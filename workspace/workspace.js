const storedToken = localStorage.getItem("authToken")
const storedEmail = localStorage.getItem("authEmail")

const api = "http://[2a01:cb11:ecc:b300:9dd7:f038:2bc6:b17e]:8000"

const table = document.getElementById("table")

table.innerHTML = ''

const get_content_info = {
    "token": storedToken,
    "email": storedEmail
}

const imageExtensions = [
    ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".tif", ".webp", ".svg"
]

const textExtensions = [
    ".txt", ".md", ".rtf", ".pdf", ".doc", ".docx", ".odt", ".rtf", ".tex", ".wpd"
]

const audioExtensions = [
    ".mp3", ".wav", ".aac", ".ogg", ".flac", ".m4a", ".wma", ".alac"
]

const videoExtensions = [
    ".mp4", ".avi", ".mkv", ".mov", ".wmv", ".flv", ".webm", ".mpeg", ".mpg", ".3gp"
]

const archiveExtensions = [
    ".zip", ".rar", ".tar", ".gz", ".7z", ".bz2", ".xz", ".tar.gz", ".tar.bz2"
]

const presentationExtensions = [
    ".ppt", ".pptx", ".odp", ".key"
]

const spreadsheetExtensions = [
    ".xls", ".xlsx", ".ods", ".csv", ".tsv"
]

function delete_file(filename) {
    const delete_file_info = {
        "token": storedToken,
        "email": storedEmail,
        "file": filename
    }

    fetch(api + "/delete", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(delete_file_info),
    })
        .then(response => response.text())
        .then(response => {
            location.reload()
        })
        .catch(error => {
            console.error("Erreur lors de l'envoi de la requête : ", error);
        })
    
}

function download_file(filename) {
    const download_file_info = {
        "token": storedToken,
        "email": storedEmail,
        "file": filename
    }

    fetch(api + "/download_file", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(download_file_info),
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.blob()
        })
        .then(blob => {
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = filename
            link.click()
            URL.revokeObjectURL(link.href)
        })
        .catch(error => {
            console.error("Erreur lors de l'envoi de la requête ou du téléchargement : ", error)
        })
}

const popup_action = document.getElementById("popup-action")
const popup_action_close = document.getElementById("popup-action-close")

popup_action_close.addEventListener("click", function() {
    popup_action.style.display = "none"
})

popup_action.style.display = "none"

function load_files(files) {
    table.innerHTML = ``

    files.forEach(fichier => {   

        let fileHTML = `
        <tr>
            <td class="name">
                <div class="name-display">
                    <div>
                        ${getIcon(fichier.extension)}
                    </div>
                    <div class="file_name">
                        <span style="color: #558f4f;">${fichier.nom}${fichier.extension}</span>
                    </div>
                </div>
            </td>
            <td class="taille">
                <div class="file_taille">
                    <span style="color: #558f4f;">${fichier.taille} ${fichier.unité}</span>
                </div>
                <div>
                    <i class="fa-solid fa-download download-file" data-filename="${fichier.nom}${fichier.extension}"></i>
                    <i class="fa-solid fa-trash delete-file" data-filename="${fichier.nom}${fichier.extension}"></i>
                    <i class="fa-solid fa-bars" data-filename="${fichier.nom}${fichier.extension}"></i>
                </div>
            </td>
        </tr>
        `

        table.innerHTML += fileHTML
    })

    const deleteIcons = table.querySelectorAll('.fa-trash')
    deleteIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            const filename = e.target.getAttribute('data-filename')
            delete_file(filename)
        })
    })

    const downloadIcon = table.querySelectorAll('.fa-download')
    downloadIcon.forEach(icon => {
        icon.addEventListener('click', (e) => {
            const filename = e.target.getAttribute('data-filename')
            download_file(filename)
        })
    })

    const actionIcon = table.querySelectorAll('.fa-bars')
    actionIcon.forEach(icon => {
        icon.addEventListener('click', (e) => {
            const filename = e.target.getAttribute('data-filename')
            popup_action.style.display = "block"
            console.log(filename)
            localStorage.setItem("filename", filename)
        })
    })
}

function getIcon(extension) {
    if (imageExtensions.includes(extension)) {
        return `<i class="fa-solid fa-image"></i>`
    } else if (extension == ".pdf") {
        return `<i class="fa-solid fa-file-pdf"></i>`
    } else if (textExtensions.includes(extension)) {
        return `<i class="fa-solid fa-file-lines"></i>`
    } else if (audioExtensions.includes(extension)) {
        return `<i class="fa-solid fa-file-audio"></i>`
    } else if (videoExtensions.includes(extension)) {
        return `<i class="fa-solid fa-film"></i>`
    } else if (archiveExtensions.includes(extension)) {
        return `<i class="fa-solid fa-file-zipper"></i>`
    } else if (presentationExtensions.includes(extension)) {
        return `<i class="fa-solid fa-file-powerpoint"></i>`
    } else if (spreadsheetExtensions.includes(extension)) {
        return `<i class="fa-solid fa-file-excel"></i>`
    } else {
        return `<i class="fa-solid fa-file"></i>`
    }
}

fetch(api + "/get_content", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(get_content_info),
})
    .then(response => response.json())
    .then(response => {
        console.log(response)
        load_files(response)
    })
    .catch(error => {
        console.error("Erreur lors de l'envoi de la requête : ", error)
    })

const popup_import = document.getElementById("popup_import")
const popup_import_close = document.getElementById("close")
const import_file = document.getElementById("import_file")

popup_import.style.display = "none"

import_file.addEventListener("click", function() {
    popup_import.style.display = "block"
})

popup_import_close.addEventListener("click", function() {
    popup_import.style.display = "none"
})

const import_file_send = document.getElementById("import_file_send");

import_file_send.addEventListener("click", function() {
    const formData = new FormData();

    const files = document.getElementById("files").files

    if (files.length > 0) {
        formData.append("files", files[0])
    }

    formData.append("token", storedToken);
    formData.append("email", storedEmail);

    fetch(api + "/upload", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => location.reload())
    .catch(error => console.error('Erreur:', error));
})

const get_infos = {
    "email": storedEmail,
    "token": storedToken
}

fetch(api + "/get_infos", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(get_infos),
})
    .then(response => response.json())
    .then(response => {
        const infos_account = response
        console.log(infos_account)

        const progress_bar = document.getElementById("progress_bar")
        const progress_bar_info = document.getElementById("progress_bar_info")
        const plan = document.getElementById("plan")
        const plan_crow = document.getElementById("plan_crow")

        if (infos_account["storage_max_GB"] == 0) {
            progress_bar_info.innerText = `${infos_account["storage_used_GB"]} Go utilisé sur ${infos_account["storage_max"]} Go` 
        } else if (infos_account["storage_used_GB"] > 1) {
            progress_bar_info.innerText = `${infos_account["storage_used_GB"]} Go utilisés sur ${infos_account["storage_max_GB"]} Go`
        } else {
            progress_bar_info.innerText = `${infos_account["storage_used_GB"]} Go utilisé sur ${infos_account["storage_max_GB"]} Go`    
        }

        let planText = infos_account["plan"]

        plan.innerText = planText.charAt(0).toUpperCase() + planText.slice(1)

        if (infos_account["plan"] == "free") {
            plan_crow.style.display = "none"
        } else {
            plan_crow.style.display = "block"
        }

        progress_bar.style.width = `${infos_account["storage_used_percentage"]}%`

    })
    .catch(error => {
        console.error("Erreur lors de l'envoi de la requête : ", error)
        window.location.href = "../error/error.html"
    })

if (storedEmail && storedToken) {
    console.log("Connect")
} else {
    window.location.href = "../index.html"
}


