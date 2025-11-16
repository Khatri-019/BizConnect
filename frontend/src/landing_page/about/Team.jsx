import './Team.css'
import Person from "./Person";

function Team() {
    return ( 
        <div className="container-fluid team-container">
            <div className="team-heading">
                <h1>Team</h1>
            </div>
            <div className="row team-members-row">
                <Person  img={"media/images/person1.png"} name={"Ragnar Johnson"} role={"Co founder & CEO"}/>
                <Person  img={"media/images/person2.png"} name={"Kenji Tanaka"} role={"VP of Business Development"}/>
                <Person  img={"media/images/person3.png"} name={"John Rogers"} role={"Chief Technology Officer"}/>
                <Person  img={"media/images/person4.png"} name={"Amara Okoye"} role={"Data Privacy Officer"}/>
                <Person  img={"media/images/person5.png"} name={"Sofia Martinez"} role={"Global Brand Manager"}/>
                <Person  img={"media/images/person6.png"} name={"James Lurther"} role={"Senior UX Designer"}/>
            </div>
        </div>
     );
}

export default Team;