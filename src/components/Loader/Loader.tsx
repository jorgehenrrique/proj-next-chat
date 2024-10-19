import './assets/style.css';

export default function Loader() {
  return (
    <div className='spinner flex items-center justify-center h-full w-full'>
      <span className='spinner-part-0'></span>
      <span className='spinner-part-1'></span>
      <span className='spinner-part-2'></span>
      <span className='spinner-part-3'></span>
      <span className='spinner-part-0'></span>
      <span className='spinner-part-1'></span>
      <span className='spinner-part-2'></span>
      <span className='spinner-part-3'></span>
    </div>
  );
}
