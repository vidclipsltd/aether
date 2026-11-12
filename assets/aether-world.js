/* Aether's landing-page particle field, adapted for every product page. */
(function(){
  'use strict';
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  if(!window.THREE)return;
  const host=document.createElement('div');
  host.id='aether-world';
  Object.assign(host.style,{position:'fixed',inset:'0',zIndex:'0',pointerEvents:'none',opacity:'.72',overflow:'hidden'});
  document.body.prepend(host);
  try{
    const THREE=window.THREE, scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,.1,1000);
    camera.position.set(0,0,30);
    const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));
    renderer.setSize(innerWidth,innerHeight);
    host.appendChild(renderer.domElement);
    const count=innerWidth<700?5200:10000;
    const geometry=new THREE.BufferGeometry();
    const positions=new Float32Array(count*3), shapeA=new Float32Array(count*3),shapeB=new Float32Array(count*3),shapeC=new Float32Array(count*3);
    for(let i=0;i<count*3;i+=3){
      const u=Math.random(),v=Math.random(),theta=u*Math.PI*2,phi=Math.acos(2*v-1),r=12*Math.cbrt(Math.random());
      positions[i]=r*Math.sin(phi)*Math.cos(theta);positions[i+1]=r*Math.sin(phi)*Math.sin(theta);positions[i+2]=r*Math.cos(phi);
      const layer=Math.floor(Math.random()*5),z=(layer-2)*3;
      shapeA[i]=(Math.random()-.5)*22;shapeA[i+1]=(Math.random()-.5)*14;shapeA[i+2]=z+(Math.random()-.5);
      shapeB[i]=(Math.random()-.5)*18;shapeB[i+1]=(Math.random()-.5)*18;shapeB[i+2]=(Math.random()-.5)*6;
      const t=Math.random();
      if(t<.4){shapeC[i]=-4+(Math.random()-.5)*1.5;shapeC[i+1]=-8+t*20+(Math.random()-.5);shapeC[i+2]=(Math.random()-.5)*3}
      else if(t<.8){shapeC[i]=4+(Math.random()-.5)*1.5;shapeC[i+1]=12-t*20+(Math.random()-.5);shapeC[i+2]=(Math.random()-.5)*3}
      else{shapeC[i]=(Math.random()-.5)*6;shapeC[i+1]=(Math.random()-.5)*1.5;shapeC[i+2]=(Math.random()-.5)*3}
    }
    geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
    const material=new THREE.PointsMaterial({color:0x00ffcc,size:innerWidth<700?.15:.12,transparent:true,opacity:.78,blending:THREE.AdditiveBlending,depthWrite:false});
    const cloud=new THREE.Points(geometry,material);scene.add(cloud);
    let progress=0,targetProgress=0,mx=0,my=0,tx=0,ty=0,last=0;
    const updateScroll=()=>{const max=document.documentElement.scrollHeight-innerHeight;targetProgress=max>0?scrollY/max:0};
    addEventListener('scroll',updateScroll,{passive:true});updateScroll();
    addEventListener('pointermove',e=>{tx=(e.clientX/innerWidth-.5)*.4;ty=(e.clientY/innerHeight-.5)*.4},{passive:true});
    const clock=new THREE.Clock(), attr=geometry.attributes.position;
    let raf=0,alive=true;
    function frame(now){
      if(!alive)return;
      raf=requestAnimationFrame(frame);
      if(now-last<30)return;last=now;
      const time=clock.getElapsedTime();
      progress+=(targetProgress-progress)*.08;mx+=(tx-mx)*.05;my+=(ty-my)*.05;
      camera.position.x=mx*4+Math.sin(time*.2);camera.position.y=-my*4+Math.cos(time*.2);camera.lookAt(0,0,0);
      const out=attr.array;
      for(let i=0;i<count;i++){
        const j=i*3;let a,b,c,p;
        if(progress<.33){p=progress/.33;a=positions[j];b=shapeA[j];c=shapeA[j+1];out[j]=a+(b-a)*p;out[j+1]=positions[j+1]+(c-positions[j+1])*p;out[j+2]=positions[j+2]+(shapeA[j+2]-positions[j+2])*p}
        else if(progress<.66){p=(progress-.33)/.33;out[j]=shapeA[j]+(shapeB[j]-shapeA[j])*p;out[j+1]=shapeA[j+1]+(shapeB[j+1]-shapeA[j+1])*p;out[j+2]=shapeA[j+2]+(shapeB[j+2]-shapeA[j+2])*p}
        else{p=(progress-.66)/.34;out[j]=shapeB[j]+(shapeC[j]-shapeB[j])*p;out[j+1]=shapeB[j+1]+(shapeC[j+1]-shapeB[j+1])*p;out[j+2]=shapeB[j+2]+(shapeC[j+2]-shapeB[j+2])*p}
        out[j]+=(Math.sin(time+i)*.04);out[j+1]+=(Math.cos(time+i)*.04);
      }
      attr.needsUpdate=true;cloud.rotation.y=time*.05+progress*Math.PI;renderer.render(scene,camera);
    }
    raf=requestAnimationFrame(frame);
    let resizeTimer=0;
    addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)},{passive:true});
    document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf)}else if(alive){last=0;raf=requestAnimationFrame(frame)}});
    addEventListener('pagehide',()=>{alive=false;cancelAnimationFrame(raf);geometry.dispose();material.dispose();renderer.dispose()},{once:true});
  }catch(error){console.warn('Aether particle background unavailable:',error);host.remove()}
})();