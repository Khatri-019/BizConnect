import "./FAQ.css";

function FAQ() {
    return (
        <>
            <div class="accordion my-accordion" id="accordionExample">
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button
                            class="accordion-button"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseOne"
                            aria-expanded="false"
                            aria-controls="collapseOne"
                        >
                            How do I enable real time translation during calls ?
                        </button>
                    </h2>
                    <div
                        id="collapseOne"
                        class="accordion-collapse collapse"
                        data-bs-parent="#accordionExample"
                    >
                        <div class="accordion-body">
                            Click the translation icon in your call controls, select your
                            preferred languages, and the AI will automatically translate
                            speech and text in real-time.
                        </div>
                    </div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button
                            class="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseTwo"
                            aria-expanded="false"
                            aria-controls="collapseTwo"
                        >
                            What file types can I share during conversations ?
                        </button>
                    </h2>
                    <div
                        id="collapseTwo"
                        class="accordion-collapse collapse"
                        data-bs-parent="#accordionExample"
                    >
                        <div class="accordion-body">
                            You can share PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, and image
                            files up to 100MB each. All files are encrypted during transfer.
                        </div>
                    </div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button
                            class="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseThree"
                            aria-expanded="false"
                            aria-controls="collapseThree"
                        >
                            Can I record my business conversations ?
                        </button>
                    </h2>
                    <div
                        id="collapseThree"
                        class="accordion-collapse collapse"
                        data-bs-parent="#accordionExample"
                    >
                        <div class="accordion-body">
                            Yes, with consent from all participants. Recordings are encrypted
                            and stored securely for 30 days unless you choose to download
                            them.
                        </div>
                    </div>
                </div>

                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button
                            class="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseFour"
                            aria-expanded="false"
                            aria-controls="collapseFour"
                        >
                            How do I manage my team's access and permissions ?
                        </button>
                    </h2>
                    <div
                        id="collapseFour"
                        class="accordion-collapse collapse"
                        data-bs-parent="#accordionExample"
                    >
                        <div class="accordion-body">
                            Go to Settings , then go to Team Management to add members, set
                            roles, and configure permissions for different features and
                            billing access.
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default FAQ;
