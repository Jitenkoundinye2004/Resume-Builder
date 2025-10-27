import ImageKit from '@imagekit/nodejs';

const imageKit= new ImageKit({
  privateKey: process.env.IMAGEKIT_PUBLIC_KEY, 
});



export default imageKit;