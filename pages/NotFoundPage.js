import not_found from '../assetss/images/404.png';


const divStyle = {
    width: '100%',
    height: '700px',
    backgroundImage: `url(${not_found})`,
    backgroundSize: 'cover',
    opacity: 0.3
  };
export default function AboutPage(){
    return(
        <div className="container" style={divStyle} >
            
        </div>
    )
}