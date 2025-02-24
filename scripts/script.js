const input = document.querySelector('.repo-input');
const autoComplete = document.querySelector('.autocomplete');
const repoListContainer = document.querySelector('.repo-list');

let addedRepositories = [];

async function fetchRepositories(repo) {
    const response = await fetch(`https://api.github.com/search/repositories?q=${repo}&per_page=5`);
    if (response.ok) {
        const data = await response.json();
        console.log(data.items)
        return data.items;
    }
}


function updateAutocomplete(repositories) {
    autoComplete.textContent = "";
    if (repositories.length > 0) {
        autoComplete.style.display = 'block'
    } else {
        autoComplete.style.display = 'none'
    }
    let listItems = [];
    console.log(listItems)
    repositories.forEach(repo => {
        const listItem = document.createElement("div");
        listItem.classList.add('autocomplete__item')
        listItem.textContent = repo.name;
        listItem.addEventListener("click", () => {
            addRepository(repo);
            input.value = "";
            autoComplete.style.display = 'none';
        });
        listItems.push(listItem)
    });
    autoComplete.append(...listItems);
}

function addRepository(repositories) {
    if (addedRepositories.find(repo => repo.id === repositories.id)) {
        return;
    }
    addedRepositories.push(repositories);
    CreateRepositories();
}

function removeRepository(repoId) {
    addedRepositories = addedRepositories.filter(repo => repo.id !== repoId);
    CreateRepositories();
}

function CreateRepositories() {
    repoListContainer.innerHTML = "";
    let createrepo = []
    addedRepositories.forEach(repo => {
        let repoListItem = document.createElement("div");
        repoListItem.classList.add("repo-list__item");
        let elName = document.createElement("div");
        elName.classList.add("repo-list__title");
        elName.textContent = `Репозиторий: ${repo.name}`;
        let elOwner = document.createElement("div");
        elOwner.classList.add("repo-list__title");
        elOwner.textContent = `Автор: ${repo.owner.login}`;
        let elStars = document.createElement("div");
        elStars.classList.add("repo-list__title");
        elStars.textContent = `Звезды: ${repo.stargazers_count}`;
        let elDelete = document.createElement("button");
        elDelete.classList.add("delete-repo");
        elDelete.setAttribute("data-repo-id", repo.id);
        elDelete.addEventListener("click", () => {
            removeRepository(repo.id);
        })
        repoListItem.append(...[elName, elOwner, elStars, elDelete])
        createrepo.push(repoListItem)
    });

    repoListContainer.append(...createrepo)

};



function debounce(callback, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => { callback(...args); }, delay);
    };
}

const Input = debounce(async (event) => {
    const query = event.target.value;
    const repositories = await fetchRepositories(query);
    updateAutocomplete(repositories);
}, 300);


input.addEventListener('input', Input);


