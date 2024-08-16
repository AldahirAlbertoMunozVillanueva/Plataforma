import imageMobile from '../assets/mobile.jpg';
import imageDesktop from '../assets/desktop.jpg'; 

export const MainArticle = () => {
  return (
    <section>
        <picture>
        <source media='(max-width: 640px)' srcSet={imageMobile} />
        <source media='(min-width: 641px)' srcSet={imageDesktop} />
            <img src={imageMobile} alt="image" className="w-full object-cover" />
        </picture>
        <div className='sm:flex'>
          <div className='flex-1 py-6'>
            <h2 className='text-[40px] leading-none font-bold sm:text-[58px]'>Mision</h2>
          </div>
          <div className='flex-1  pt-9 px-4'>
            <p className='mb-10 text-[13px] sm:text-[15px] '>Nuestra misión es proporcionar acceso libre y 
              equitativo a la información, fomentar el amor por la lectura y apoyar el aprendizaje continuo 
              en nuestra comunidad a través de una amplia gama de recursos y servicios.</p>
          </div>
        </div>
        <div className='sm:flex'>
          <div className='flex-1 py-6'>
            <h2 className='text-[40px] leading-none font-bold sm:text-[58px]'>vision</h2>
          </div>
          <div className='flex-1  pt-9 px-4'>
            <p className='mb-10 text-[13px] sm:text-[15px] '>Ser un centro de referencia cultural y educativo, 
              reconocido por la excelencia en nuestros servicios, la innovación en la gestión del conocimiento 
              y el impacto positivo en la comunidad.</p>
          </div>
        </div>
        <div className='sm:flex'>
          <div className='flex-1 py-6'>
            <h2 className='text-[40px] leading-none font-bold sm:text-[58px]'>Servicios Ofrecidos</h2>
          </div>
          <div className='flex-1  pt-9 px-4'>
            <p className='mb-10 text-[13px] sm:text-[15px] '>Las bibliotecas ofrecen diversos servicios como Préstamo de Libros: 
              Información básica sobre cómo los usuarios pueden tomar prestados libros.
              Acceso a Computadoras: Detalles sobre la disponibilidad de computadoras y conexión a internet.
              Actividades Educativas: Información sobre talleres, charlas y programas educativos. </p>
          </div>
        </div>
    </section>
  )
}
