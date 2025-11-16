import "./CategoryCard.css"


function CategoryCard({ Icon, cardTitle, cardBody, cardTextSecondary }) {
    return (
        <div className="card mb-3 category-card" >
            <div className="row g-0">
                <div className="col-md-2 category-card-icon-div">
                    {Icon}
                </div>
                <div className="col-md-8">
                    <div className="card-body category-card-body">
                        <h5 className="card-title category-card-title">{cardTitle}</h5>
                        <p className="card-text category-card-text">
                           {cardBody}
                        </p>
                        <p className="card-text">
                            <small className="text-body-secondary category-card-secon-text">{cardTextSecondary}</small>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CategoryCard;
