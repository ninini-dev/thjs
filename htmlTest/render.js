device=[];
vertexData=[];
storageBuffer=[];
bindGroup=[];
pipeline=[];
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

function createSSBO(){
  
const bufferSize=3;
storageBuffer = device.createBuffer({
  size: 8*bufferSize,
  usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
});
 bindGroup = device.createBindGroup({
    label: 'bind group for objects',
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: storageBuffer },
    ],
  });
  const instanceData = new Float32Array([
      -200/300,-200/480,
      -200/300,200/480,
      200/300,-200/480,
]);
  device.queue.writeBuffer(storageBuffer, 0, instanceData);

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
struct InstanceData {
    offset: vec2<f32>,
};

@group(0) @binding(0) var<storage, read> pos_per_ins: array<InstanceData>;
@vertex
fn vs_main(
  input: VertexInput,
  @builtin(instance_index) instanceIndex: u32 ,
  @builtin(vertex_index) vertexIndex : u32
  ) -> @builtin(position) vec4f {
  return vec4f( input.position+pos_per_ins[instanceIndex].offset, 0.0, 1.0);
}

@fragment
fn fs_main() -> @location(0) vec4f {
  return vec4f(1.0, 0.0, 0.0, 1.0); // Red color
}
`;

const shaderModule = device.createShaderModule({ code: shaderCode });
createBuffer();
pipeline = device.createRenderPipeline({
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

createSSBO();
renderPass.setBindGroup(0, bindGroup);

renderPass.draw(4,3); // Draw 3 vertices
renderPass.end();

device.queue.submit([commandEncoder.finish()]);
}
rend();