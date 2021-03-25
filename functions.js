let allTeams = [];
let editId;

function getHtmlTeams(teams) {
    return teams.map(team => {
        return `<tr>
            <td>${team.members}</td>
            <td>${team.name}</td>
            <td>${team.url}</td>
            <td>
                <a href="#" class="remove-btn" data-id="${team.id}">&#10006;</a>
                <a href="#" class="edit-btn" data-id="${team.id}">&#9998;</a>
            </td>
        </tr>`
    }).join("")
}

function showTeams(teams) {
    const html = getHtmlTeams(teams);

    const tbody = document.querySelector("tbody");
    tbody.innerHTML = html;
}

fetch("http://localhost:3000/teams-json")
    .then(r => r.json())
    .then(teams => {
        allTeams = teams;
        showTeams(teams);
    });

function loadTeams() {
    fetch("http://localhost:3000/teams-json")
        .then(r => r.json())
        .then(teams => {
            allTeams = teams;
            showTeams(teams);
        });
}
loadTeams();

function addTeam(team) {
    console.warn("save team", JSON.stringify(team))
    fetch("http://localhost:3000/teams-json/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(team)
    })
        .then(r => r.json())
        .then(status => {
            if (status.success) {
                loadTeams();
            }
        });
}

function updateTeam(team) {
    console.warn("save team", JSON.stringify(team))
    fetch("http://localhost:3000/teams-json/update", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(team)
    })
        .then(r => r.json())
        .then(status => {
            if (status.success) {
                window.location.reload()
            }
        });
}

function removeTeam(id) {
    fetch("http://localhost:3000/teams-json/delete", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: id })
    })
        .then(r => r.json())
        .then(status => {
            if (status.success) {
                window.location.reload()
            }
        });
    ;
}

function saveTeam() {
    const members = document.querySelector("input[name=members]").value;
    const name = document.querySelector("input[name=name]").value;
    const url = document.querySelector("input[name=url]").value;

    const team = {
        name: name,
        members: members,
        url: url
    };
    console.warn(team, editId)
    if (editId) {
        team.id = editId;
        console.warn("update", team, editId)
        updateTeam(team);
    } else {
        addTeam(team);
    }
}

document.querySelector("table tbody").addEventListener("click", e => {
    if (e.target.matches("a.remove-btn")) {
        const id = e.target.getAttribute('data-id');
        removeTeam(id);
    }
    else if (e.target.matches("a.edit-btn")) {
        document.getElementById("saveBtn").innerText = "Update"


        const id = e.target.getAttribute('data-id');
        const editTeam = allTeams.find(team => team.id == id);
        setValues(editTeam);
        editId = id;
    }
});

document.getElementById('search').addEventListener('input', e => {
    const text = e.target.value.toLowerCase();
    console.warn('search', e.target.value);

    const filtered = allTeams.filter(team => {
        return team.members.toLowerCase().indexOf(text) > -1
    });
    console.warn(filtered);
    showTeams(filtered);
});

function setValues(team) {
    console.warn("edit", team)
    document.querySelector("input[name=members]").value = team.members;
    document.querySelector("input[name=name]").value = team.name;
    document.querySelector("input[name=url]").value = team.url;
};
