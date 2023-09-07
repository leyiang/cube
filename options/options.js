let blockRules = {};

function updateRules() {
    chrome.storage.sync.set({ blockRules });
    location.reload();
}


document.querySelector(".save-all").addEventListener("click", e => {
    chrome.runtime.reload();
});

function dom(inner) {
    const div = document.createElement("div");
    div.innerHTML = inner;
    return div.firstElementChild;
}

function createRuleDOM(uri) {
    //language=HTML
    const template = `
        <form class="rule-item">
            <input type="text" class="url-input" placeholder="Uri" value="${uri}" required>
            <button class="remove-btn" type="button">Remove</button>
            <button>Update</button>
        </form>
    `;

    return dom(template);
}

chrome.storage.sync.get(["blockRules"], items => {
    blockRules = items.blockRules;

    ["white", "black"].forEach(which => {
        const section = document.querySelector(`.${which}-list`);
        const whichKey = which + "List";

        blockRules[whichKey].forEach( uri => {
            const formDOM = createRuleDOM(uri);
            section.appendChild(formDOM);

            const remove = formDOM.querySelector(".remove-btn");
            remove.addEventListener("click", () => {
                if (confirm("You sure to remove?")) {
                    const index = blockRules[whichKey].indexOf( uri );
                    if( index >= 0 ) {
                        blockRules[whichKey].splice( index );
                        updateRules()
                    } else {
                        alert("Remove failed!");
                    }
                }
            });

            formDOM.addEventListener("submit", e => {
                e.preventDefault();
                const newUrl = formDOM.querySelector(".url-input").value;

                const index = blockRules[whichKey].indexOf( uri );
                if( index >= 0 ) {
                    blockRules[whichKey][index] = newUrl;
                    updateRules()
                } else {
                    alert("Update failed!");
                }
                updateRules();
            });
        });
    });
});

document.querySelectorAll(".add-new").forEach(el => {
    el.addEventListener("click", (e) => {
        const which = e.target.dataset.which;

        const template = `
            <form class="rule-item">
                <input type="text" placeholder="Uri" class="url-input" required>
                <button>Save</button>
            </form>
        `;

        const newDOM = dom(template);
        el.parentNode.appendChild(newDOM);

        const whichKey = which.toLowerCase() + "List";

        newDOM.addEventListener("submit", (e) => {
            e.preventDefault();
            const uri = newDOM.querySelector(".url-input").value;
            blockRules[whichKey]?.push( uri );
            updateRules();
        });
    });
})
