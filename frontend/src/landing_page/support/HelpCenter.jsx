import "./HelpCenter.css"
import Category from "./Category";
import FAQ from "./FAQ";

function HelpCenter() {
    return (
        <>
            <div className="container-fluid  help-center-container">
                <div className="row category">
                    <div className="col-lg-8 col-md-12">
                        <h1 className="section-title" >Browse by Category</h1>
                        <Category />
                    </div>
                    <div className="col-lg-4 col-md-12" >
                        <h1 className="section-title" >Frequently Asked Questions</h1>
                        <FAQ />
                    </div>
                </div>
            </div>
        </>
    );
}

export default HelpCenter;
