var appTemplates = {

    getNewTitlesTemplate: function () {
	   //before a user creates any notes, 
        //they have to name in order to be more orderly. they can
        //always go back and change it.
        return `<div class="row">
                    <div class="note-container">
                        <div class="col-12 titles-content">
                        <div class="emtpy-titles-error">PLEASE FILL OUT BOTH FIELDS!</div>
                        <form method="post" action="/new-note" class="new-note">
                            <fieldset name="create-note">
                                <label class="title-label">Title</label>    
                                <input type="text" name="title" class="title-field" placeholder="eg. Biology" required />
                                <label class="subtitle-label">Subtitle</label>
                                <input type="text" name="subtitle" class="subtitle-field" placeholder="eg. Life Science For School" required />
                                <button class="start-notes">Start Creating Notes</button>
                            </fieldset>
                        </form>
                    </div>
                </div>`
    },

    getNewNoteTemp: function (noteId) {
            return  `<div class="row">
                        <div class="col-12 header-container">
                            <!--this will be hidden at first -->
                            <div class="emtpy-titles-error">PLEASE FILL OUT BOTH FIELDS!</div>
                            <div class="header-name"> 
                                <span class="header-text"></span> 
                            </div>
                            <div class="header-value">  
                                <div class="note-error-message">PLEASE FILL OUT 'Header' Field</div>
                                    <label class="header-label">header</label>
                                    <input type="text" name="header" class="update-header-field" required />
                                    <div class="note-id">${noteId}</div>
                            </div> 
                            <div class="note"></div>
                            <div class="note-error-message">PLEASE MAKE SURE NOTE TO LEAVE A BLANK NOTE!</div>
                            <div class="editing-note-container">
                                <textarea class="edit-note"></textarea>
                                <div class="create-button-container"><button class="create-note">Create Note</button></div>
                            </div>
                        </div>
                    </div>`
    },

    getNoteHomeTemp: function (title, subtitle, noteId) {
        return `<div class="row">
                <div class="col-12 title-container">
                    <!--this will be hidden at first -->
                    <a href="#" class="create-new-section">New Section</a>
                    <a href="#" class="sections-button">Note Sections</a>
                    <a href="#" class="hide-sections">Hide Sections</a>
                    <div class="sections-container">
                    </div>
                    <div class="note-id">${noteId}</div>
                    <div class="emtpy-titles-error">PLEASE FILL OUT BOTH FIELDS!</div>
                    <div class="titles"> 
                        <span class="title-text">${title}</span>  
                        <span class="subtitle-text">${subtitle}</span> 
                    </div>
                    <div class="edit-title">  
                        <div class="error-message">PLEASE FILL OUT BOTH Fields</div>
                        <div class="edit-titles-container">
                            <label class="update-title-label">title</label>
                            <input type="text" name="title" class="update-title-field" required />
                            <label class="update-subtitle-label">subtitle</label>
                            <input type="text" name="subtitle" class="update-subtitle-field" required />
                        </div>
                        <button class="update-titles">Save</button>
                        <button class="cancel-update">Cancel</button>
                    </div> 
                </div>
            </div>`
    },

    getNewSectionTemp: function (noteId) {
    return `<main>
                        <div class="row">
                            <div class="col-12 header-container">
                                <!--this will be hidden at first -->
                                <div class="emtpy-titles-error">PLEASE FILL OUT BOTH FIELDS!</div>
                                <div class="header-name"> 
                                    <span class="header-text"></span> 
                                </div>
                                <div class="header-value">  
                                    <div class="note-error-message">PLEASE FILL OUT 'Header' Field</div>
                                        <label class="header-label">header</label>
                                        <input type="text" name="header" class="update-header-field" required />
                                    <div class="note-id">${noteId}</div>
                                </div> 
                                <div class="note"></div>
                                <div class="note-error-message">PLEASE MAKE SURE NOTE TO LEAVE A BLANK NOTE!</div>
                                <div class="editing-note-container">
                                    <label class="note-label">Note </label>
                                    <textarea class="edit-note"></textarea>
                                    <div class="create-button-container"><button class="create-note">Create Note</button></div>
                                </div>
                            </div>
                        </div>
                    </main>`
    },

    createSectionHTML: function (section) {
        return `<div class="section-id">${section._id}</div><a href="#" class="note-section">${section.header}</a>`
    },

    getNoteTemp: function (noteId, currentNote) {
        return `<div class="row">
                <div class="col-12 header-container">
                    <a href="#" class="create-new-section">New Section</a>
                    <a href="#" class="sections-button">Note Sections</a>
                    <a href="#" class="hide-sections">Hide Sections</a>
                    <div class="sections-container">
                    </div>
                    <div class="emtpy-titles-error">PLEASE FILL OUT BOTH FIELDS!</div>
                    <div class="header"> 
                        <span class="header-text">${currentNote.header}</span> 
                    </div>
                    <div class="edit-header">  
                        <div class="error-message">PLEASE FILL OUT BOTH FIELD</div>
                        <div class="edit-header-container">
                            <label class="update-header-label">header</label>
                            <input type="text" name="header" class="update-header-field" required />
                        </div>
                        <button class="update-header">Update</button>
                        <button class="cancel-header">Cancel</button>
                        <!-- note temporarily placed by the button for quick ui swipe -->
                    </div> 
                </div>
            </div>
            <div class="row">
                <div class="col-12 note-container">
                    <div class="note-id">${noteId}</div>
                    <div>just click the note words below to edit =) </div>
                    <div class="note">${currentNote.note}</div>
                    <div class="editing-note-container hide-edit-note">
                        <div class="note-error-message">PLEASE MAKE SURE NOTE TO LEAVE A BLANK NOTE!</div>
                        <textarea class="edit-note"></textarea>
                        <div class="save-button-container"><button class="save-note">Save</button></div>
                        <div class="section-id">${currentNote._id}</div>
                    </div>
                </div>
            </div>`
    }
}