device=[];
vertexData=[];
function createBuffer(){
    const vertexData = new Float32Array([
      -32/300,-32/480,
      -32/300,32/480,
      32/300,-32/480,
      32/300,32/480,
]);
vertexBuffer = device.createBuffer({
  size: vertexData.byteLength,
  usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
});

// Enviar los datos del CPU a la GPU
device.queue.writeBuffer(vertexBuffer, 0, vertexData);

}
async function rend(){
const adapter = await navigator.gpu.requestAdapter();
device = await adapter.requestDevice();
const context = canvas.getContext('webgpu');

context.configure({
  device,
  format: navigator.gpu.getPreferredCanvasFormat(),
});

const shaderCode = `
struct VertexInput {
    @location(0) position: vec2<f32>,
};
@vertex
fn vs_main(input: VertexInput, @builtin(vertex_index) vertexIndex : u32) -> @builtin(position) vec4f {
  var pos = array<vec2f, 3>(
    vec2f(0.0, 0.5),   // Top
    vec2f(-0.5, -0.5), // Bottom Left
    vec2f(0.5, -0.5)   // Bottom Right
  );
  return vec4f(input.position, 0.0, 1.0);
}

@fragment
fn fs_main() -> @location(0) vec4f {
  return vec4f(1.0, 0.0, 0.0, 1.0); // Red color
}
`;

const shaderModule = device.createShaderModule({ code: shaderCode });
createBuffer();
const pipeline = device.createRenderPipeline({
  layout: 'auto',
  vertex: {
    module: shaderModule,
    entryPoint: 'vs_main',
    buffers: [
      {
        arrayStride: 8, // 2 floats * 4 bytes
        attributes: [
          { shaderLocation: 0, offset: 0, format: "float32x2" },  // Posición
        ]
      }
    ]
  },
  fragment: {
    module: shaderModule,
    entryPoint: 'fs_main',
    targets: [{ format: navigator.gpu.getPreferredCanvasFormat() }],
  },
  primitive: {
    topology: 'triangle-strip',
  },
});
const commandEncoder = device.createCommandEncoder();
const textureView = context.getCurrentTexture().createView();

const renderPass = commandEncoder.beginRenderPass({
  colorAttachments: [{
    view: textureView,
    clearValue: { r: 0, g: 0, b: 0, a: 1 }, // Background color
    loadOp: 'clear',
    storeOp: 'store',
  }],
});

renderPass.setPipeline(pipeline);
renderPass.setVertexBuffer(0, vertexBuffer); 
renderPass.draw(4); // Draw 3 vertices
renderPass.end();

device.queue.submit([commandEncoder.finish()]);
}
rend();