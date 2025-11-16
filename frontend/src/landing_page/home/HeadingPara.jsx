import "./HeadingPara.css";

function HeadingPara({heading,para}) {
    return (
        <div className="container-fluid ">
            <div className="row my-row">
                <h1>{heading}</h1>
                <p>{para}</p>
            </div>
        </div>
    );
}

export default HeadingPara;
