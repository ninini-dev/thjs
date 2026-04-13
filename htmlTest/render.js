var ctx= null;
var canvas=null;
const Renderer = {

  createBuffer: () => {
    const vertexData = new Float32Array([
      -1,-1,
      -1,1,
      1,-1,
      1,1
    ]);
    vertexBuffer = device.createBuffer({
      size: vertexData.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    }); 

    // Enviar los datos del CPU a la GPU
    device.queue.writeBuffer(vertexBuffer, 0, vertexData);
  },

  createUBO: ()=>{
    const UNIFORM_MAX = 32;
    uniformBuffer = device.createBuffer({
      size: 16 * (UNIFORM_MAX+1),
      usage: GPUBufferUsage.UNIFORM   | GPUBufferUsage.COPY_DST,
    });
  },

  createSSBO: () => {
    const ENTITIES_MAX = 2048;
    storageBuffer = device.createBuffer({
      size: 8 * ENTITIES_MAX,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
  },
  createTexture: async (IMG) => {

    const res= await fetch('res/'+IMG+'.png'); 
    const blob = await res.blob();
    IMG= await createImageBitmap(blob);
  
    let TEX = device.createTexture({
      size: [IMG.width, IMG.height,1],
      format: 'rgba8unorm',
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
    });
    device.queue.copyExternalImageToTexture(
      { source: IMG ,flipY: true},
      { texture: TEX },
      [IMG.width, IMG.height]
    );
    return TEX;
  },
  createGpLayout: (TEX) => {
    return device.createBindGroup({
      //label: 'bind group for objects',
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: storageBuffer },
        { binding: 1, resource: sampler },
        { binding: 2, resource: TEX.createView() },
        { binding: 3, resource: uniformBuffer}
      ],
    });
  },
  updateSSBO: (OFF, DATA) => {
    device.queue.writeBuffer(storageBuffer, OFF, DATA);
  },
   rendInit: async() => {

    adapter = await navigator.gpu.requestAdapter();
    device = await adapter.requestDevice();
    context = canvas.getContext('webgpu');

    context.configure({
      device,
      format: navigator.gpu.getPreferredCanvasFormat(),
    });

    const shaderCode = `
struct VertexInput {
    @location(0) position: vec2<f32>,
};
struct VertexOutput {
    @builtin(position) pos: vec4f,
    @location(0) uv: vec2f, // This matches the fragment input
};
struct InstanceData {
    offset: vec2<f32>,
};
struct GlobalData {
    spriteData: array<vec4f,32>,
    textureSize: f32,
};

@group(0) @binding(0) var<storage, read> pos_per_ins: array<InstanceData>;
@group(0) @binding(1) var mySampler: sampler;
@group(0) @binding(2) var myTexture: texture_2d<f32>;
@group(0) @binding(3) var<uniform> global: GlobalData;
@vertex
fn vs_main(
  input: VertexInput,
  @builtin(instance_index) instanceIndex: u32 ,
  @builtin(vertex_index) vertexIndex : u32
  ) -> VertexOutput {
    var output: VertexOutput;
    var wh: vec2f;
    wh=global.spriteData[0].zw;
    var xy: vec2f;
    xy=global.spriteData[0].xy;
    xy.y=-xy.y;

    output.pos = vec4f(input.position*wh*.5/vec2f(300,480) + pos_per_ins[instanceIndex].offset/vec2f(150,240)-1, 0.0, 1.0);
    var s:f32;
    s=global.textureSize;
    var test = array<vec2f, 4>(
        (vec2f(0,s-wh.y)+xy)/s,
        (vec2f(0,s)+xy)/s,
        (vec2f(wh.x,s-wh.y)+xy)/s,
        (vec2f(wh.x,s)+xy)/s,
    );

    output.uv = test[vertexIndex];
    
    return output;
}
@fragment
fn fs_main(input: VertexOutput) -> @location(0) vec4f {

  var color: vec4f;
  color= textureSample(myTexture, mySampler, input.uv);
  return color;
  //return vec4f(1.0, 0.0, 0.0, 1.0); // Red color
}
`;

    const shaderModule = device.createShaderModule({ code: shaderCode });
    Renderer.createBuffer();
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
        targets: [{ 
          format: navigator.gpu.getPreferredCanvasFormat(),
          blend: {
          color: {
            operation: 'add',
            srcFactor: 'src-alpha',
            dstFactor: 'one-minus-src-alpha',
          },
          alpha: {
            operation: 'add',
            srcFactor: 'one',
            dstFactor: 'one-minus-src-alpha',
          }
        }
        }],
      },
      primitive: {
        topology: 'triangle-strip',
      },
    });
    Renderer.createSSBO();
    Renderer.createUBO();
    sampler = device.createSampler({
      magFilter: 'linear',
      minFilter: 'linear',
    });
    TEX_ENM = await Renderer.createTexture('enemy');
    TEX_PL00 =  await Renderer.createTexture('pl00');
    TEX_DROP =  await Renderer.createTexture('item');
    GPL_ENM = Renderer.createGpLayout(TEX_ENM);
    GPL_PL00 = Renderer.createGpLayout(TEX_PL00);
    GPL_DROP = Renderer.createGpLayout(TEX_DROP);
  },

  rend: () => {

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
    device.queue.writeBuffer(uniformBuffer, 0,new Float32Array([0,0,32,48]));
    device.queue.writeBuffer(uniformBuffer, 32*16,new Float32Array([256.0]));
    renderPass.setBindGroup(0,GPL_PL00);
    renderPass.draw(4, plSys.x.length+1,0,Renderer.OFF_PL);
    device.queue.writeBuffer(uniformBuffer, 0,new Float32Array([32,32,32.0,32.0]));
    device.queue.writeBuffer(uniformBuffer, 32*16,new Float32Array([512.0]));
    renderPass.setBindGroup(0,GPL_ENM);
    renderPass.draw(4, enmSys.x.length,0,0);
    renderPass.setBindGroup(0,GPL_DROP);
    renderPass.draw(4, dropSys.x.length,0,Renderer.OFF_DROP);
    renderPass.end();

    device.queue.submit([commandEncoder.finish()]);
  }
}
canvas = document.getElementById("gameCanvas");

Renderer.rendInit();