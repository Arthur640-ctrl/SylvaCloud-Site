const featuresEssential = document.querySelectorAll('.Essential')
const featuresPro = document.querySelectorAll('.Pro')
const featuresStudent = document.querySelectorAll('.Student')

const popup_other_action = document.getElementById("popup-action")

var plan = ""
var usage = ""

const feature_infos = {
    "email": storedEmail,
    "token": storedToken
}

fetch(api + "/get_infos", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(feature_infos),
})
    .then(response => response.json())
    .then(response => {
        const infos_account = response
        plan = infos_account["plan"]
        usage = infos_account["usage"]
        setFeatures()
    })
    .catch(error => {
        console.error("Erreur lors de l'envoi de la requête : ", error)
    })




// ----------------------------------------
// Mise en place des fonctionnalités en fonction du plan
function setFeatures() {
    if (plan == "free") {
    for (let i = 0; i < featuresEssential.length; i++) {
        featuresEssential[i].style.display = "block"
    }
    for (let i = 0; i < featuresPro.length; i++) {
        featuresPro[i].style.display = "none"
    }
    for (let i = 0; i < featuresStudent.length; i++) {
        featuresStudent[i].style.display = "none"
    }
} else if (plan == "essential") {
    for (let i = 0; i < featuresEssential.length; i++) {
        featuresEssential[i].style.display = "none"
    }
    for (let i = 0; i < featuresPro.length; i++) {
        featuresPro[i].style.display = "block"
    }
    for (let i = 0; i < featuresStudent.length; i++) {
        featuresStudent[i].style.display = "block"
    }
}
}
// ----------------------------------------
// Génération de QR Code :
const popup_qr_code = document.getElementById("popup-qrcode")
const share_qrcode = document.getElementById("share-qrcode")
const close_qrcode = document.getElementById("close-qrcode")

const waiting = document.getElementById("waiting")
const qrcode = document.getElementById("qrcode") // La div contenant l'élément image
const qrImage = document.getElementById("qrImage") // L'élément image à l'intérieur de cette div

popup_qr_code.style.display = "none"

share_qrcode.addEventListener("click", function () {
    if (plan == "essential" || plan == "pro" || usage == "student") {
        popup_qr_code.style.display = "block"
        popup_other_action.style.display = "none"
        waiting.style.display = "block"
        qrcode.style.display = "none"

        const qr_code_infos = {
            "email": storedEmail,
            "token": storedToken,
            "file": localStorage.getItem("filename")
        }

        fetch(api + "/share/qr", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(qr_code_infos)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur lors de la génération du QR Code")
            }
            return response.blob()
        })
        .then(blob => {
            const imageUrl = URL.createObjectURL(blob)
            qrImage.src = imageUrl
            waiting.style.display = "none"
            qrcode.style.display = "block"
        })
        .catch(error => {
            waiting.style.display = "none"
            alert("Impossible de générer le QR Code : " + error.message)
            console.error("Erreur QR Code :", error)
        })
        
    } else {
        alert("Cette fonctionnalité est réservée aux comptes Premium et Pro.")
    }   
})

close_qrcode.addEventListener("click", function() {
    popup_qr_code.style.display = "none"
})

// ----------------------------------------
// Génération d'un lien de partage :' :
const popup_share = document.getElementById("popup-share")
const close_share = document.getElementById("close-share")
const share_link = document.getElementById("share-link")
const copyButton = document.getElementById("copy-link")

const waiting_link = document.getElementById("waiting-link")
const link = document.getElementById("link-div")

const input_link = document.getElementById("link")

popup_share.style.display = "none"

share_link.addEventListener("click", function () {
    popup_share.style.display = "block"
    link.style.display = "none"
    waiting_link.style.display = "block"
    popup_other_action.style.display = "none"

    const link_infos = {
        "email": storedEmail,
        "token": storedToken,
        "file": localStorage.getItem("filename")
    }

    fetch(api + "/share/link", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(link_infos)
    })
    .then(response => response.text())
    .then(response => {
        const regex = /http:\/\/[^\s]+/
        const match = response.match(regex)

        if (match) {
            const linkPart = match[0]
            waiting_link.style.display = "none"
            input_link.value = linkPart
            link.style.display = "flex"
        } else {
            console.log("Aucun lien trouvé")
        }
    })

    .catch(error => {
        console.error("Erreur Share Link :", error)
    })
})

close_share.addEventListener("click", function() {
    popup_share.style.display = "none"
})

copyButton.addEventListener("click", function() {
    const textToCopy = input_link.value

    navigator.clipboard.writeText(textToCopy)
        .then(() => {
        })
        .catch(err => {
            console.error("Impossible de copier le texte", err)
        })
})