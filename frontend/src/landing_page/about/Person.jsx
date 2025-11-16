import './Person.css'

function Person({img,name,role}) {
    return ( 
        
        <div className="person-card">
                <img src={img} alt="" />
                <h4>{name}</h4>
                <p>{role}</p>
        </div>
     );
}

export default Person;