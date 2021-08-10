
// const canvas__from = document.createElement('canvas');     //bad idea, concurrent calls will create a mess
// const canvas__to   = document.createElement('canvas');

function compressImage_p__pica(imgSrc, size__canvasTo = {width: 100, height: 100}) {

  const canvas__from = document.createElement('canvas');
  // canvas__from.backgroundColor = 'green';

  const canvas__to   = document.createElement('canvas');
  // canvas__to.backgroundColor = 'blue';


  console.log("pica", pica);
  // const Pica = pica();
  const Pica = pica({ features: [ 'js', 'wasm', 'ww', 'cib' ] });
  console.log("Pica", Pica);

  function createImage_p(imgSrc) {

    return new Promise((resolve, reject) => {
      const image = new Image();

      image.onload =  () => resolve(image);

      image.onerror = () => reject(new Error("image.onload errored"));
      image.onabort = () => reject(new Error("image.onload aborted"));

      image.src = imgSrc;
    });

  }

  return createImage_p(imgSrc)
  .then(img => {

    const imgSize = {
      width:  img.width,
      height: img.height,
    };
    console.log("imgSize", imgSize);

    //canvas__from
    // const canvas__from = document.createElement('canvas');
    canvas__from.width  = imgSize.width;
    canvas__from.height = imgSize.height;

    const ctx = canvas__from.getContext('2d');
    ctx.drawImage(img, 0, 0);

    //canvas__to
    // const canvas__to = document.createElement('canvas');
    canvas__to.width  = size__canvasTo.width;
    canvas__to.height = size__canvasTo.height;

    return [canvas__from, canvas__to];
  })
  .then(([canvas__from, canvas__to]) => {

    console.log("canvas__from", canvas__from);
    console.log("canvas__to", canvas__to);

    return (Pica).resize(canvas__from, canvas__to, {

      alpha: true,  //default: alpha:false. TODO: use it only when appropriated (pngs, )

      unsharpAmount: 80,
      unsharpRadius: 0.6,
      unsharpThreshold: 2
    });
  })
  .then(canvas => {
    // return (Pica).toBlob(canvas, 'image/jpeg', 0.90);
    return (Pica).toBlob(canvas, 'image/png', 0.90);
  })
  .finally(() => {
    //clear canvases
    clearCanvas(canvas__from);
    clearCanvas(canvas__to);

    //check if number of canvases grows
    const document_canvases = document.getElementsByTagName("canvas");
    console.log("document_canvases", document_canvases);
  });

  function clearCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  //no need to remove child canvases because we haven't done document.body.appendChild(canvasX)

  // .then(canvas => {
  //   console.log('resize done!', "canvas", canvas);
  //
  //   // document.getElementById("pica_canvasFrom").remove();
  //   // document.getElementById("pica_canvasTo").remove();
  //
  //   return (Pica).toBlob(canvas, 'image/jpeg', 0.90);
  // })
  // .catch(err => {
  //   console.log("err", err);
  //
  //   // document.getElementById("pica_canvasFrom").remove();
  //   // document.getElementById("pica_canvasTo").remove();
  // });

  // const options = {
  //
  // };
  //
  // return Pica.resizeBuffer(options);

}
