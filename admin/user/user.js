var accounts = []
var account_editing = ""

function set_user_infos(infos) {
    const info_id = document.getElementById("info_id")
    const info_email = document.getElementById("info_email")
    const info_name = document.getElementById("info_name")
    const info_fname = document.getElementById("info_fname")

    const info_plan = document.getElementById("info_plan")
    const info_usage = document.getElementById("info_usage")
    const info_totalspace = document.getElementById("info_totalspace")
    const info_usedspace = document.getElementById("info_usedspace")

    const info_mfolder = document.getElementById("info_mfolder")
    const info_mdisk = document.getElementById("info_mdisk")
    const info_bfolder = document.getElementById("info_bfolder")
    const info_bdisk = document.getElementById("info_bdisk")

    const info_token = document.getElementById("info_token")
    const info_hash = document.getElementById("info_hash")
    const info_lstip = document.getElementById("info_lstip")

    const title_info = document.getElementById("title_info")

    title_info.innerText = "Account id : " + infos[0].id

    info_id.innerText = infos[0].id
    info_email.innerText = infos[0].email
    info_name.innerText = infos[0].infos.name
    info_fname.innerText = infos[0].infos["family name"]

    info_plan.innerText = infos[0].plan
    info_usage.innerText = infos[0].usage
    info_totalspace.innerText = infos[0].storage.space + " Go"

    info_mfolder.innerText = infos[0].storage.location.main.folder
    info_mdisk.innerText = infos[0].storage.location.main.disk
    info_bfolder.innerText = infos[0].storage.location.backup.folder
    info_bdisk.innerText = infos[0].storage.location.backup.disk

    if (infos[0].storage.location.backup.disk == "") {
        info_bdisk.innerText = "Not set"
    }

    if (infos[0].storage.location.main.disk == "") {
        info_mdisk.innerText = "Not set"
    }

    info_hash.innerText = infos[0].password
    info_token.innerText = infos[0].token
    info_lstip.innerText = infos[0].ip

    if (infos[0].token == "" || infos[0].token == null) {
        info_token.innerText = "Not set"
    }

    if (infos[0].ip == "" || infos[0].ip == null) {
        info_hash.innerText = "Not set"
    }

    fetch(`http://ip-api.com/json/${infos[0].ip}`)
        .then(response => response.json())
        .then(data => {
            const info_ip = document.getElementById("info_ip")
            const info_country = document.getElementById("info_country")
            const info_city = document.getElementById("info_city")
            const info_region = document.getElementById("info_region")
            const info_lat = document.getElementById("info_lat")
            const info_lon = document.getElementById("info_lon")
            const info_isp = document.getElementById("info_isp")

            info_country.innerText = data.country
            info_city.innerText = data.city
            info_region.innerText = data.regionName
            info_lat.innerText = data.lat
            info_lon.innerText = data.lon
            info_isp.innerText = data.isp
            info_ip.innerText = data.query
        })
        .catch(error => console.error("Erreur lors de la récupération des données :", error))

}

function set_users(users) {

    const user_list = document.getElementById("user_list")
    user_list.innerHTML = ""

    users.forEach(user => {
        user_list.innerHTML += `
            <div class="user">
                <div class="user-list-user-infos">
                    <h4>${user.id}</h4>
                    <p>${user.email}</p>
                </div>
                <div class="user-list-user-action">
                    <button class="view-btn" data-id="${user.id}">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                </div>
            </div>
        `
    })

    document.querySelectorAll(".view-btn").forEach(button => {
        button.addEventListener("click", function () {
            const userId = this.getAttribute("data-id")
            console.log("ID du compte cliqué:", userId)

            const infos_users = {
                "token": storedToken,
                "user": userId,
            }
        
            fetch(api + "/admin/get_user_infos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(infos_users),
            })
                .then(response => response.json())
                .then(text => {
                    console.log(text)
                    account_editing = userId
                    set_user_infos(text)
                })
                .catch(error => {
                    console.error("Erreur lors de l'envoi de la requête : ", error);
                })
        })
    })
}



if(storedToken && storedEmail) {
    const get_users = {
        "token": storedToken,
    }

    fetch(api + "/admin/get_users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(get_users),
    })
        .then(response => response.json())
        .then(text => {
            console.log(text)
            accounts = text
            set_users(text)

        })
        .catch(error => {
            console.error("Erreur lors de l'envoi de la requête : ", error);
            window.location.href = "/error/error.html"
        })
} else {
    window.location.href = "/error/error.html"
}

const search = document.getElementById("search")

search.addEventListener("change", function () {
    const query = search.value.trim().toLowerCase()

    if (query === "") {
        set_users(accounts)
        return
    }

    const results = accounts.filter(acc => 
        acc.id.toLowerCase().includes(query) || 
        acc.email.toLowerCase().includes(query)
    )

    set_users(results)
})

const delete_account = document.getElementById("delete_account")

delete_account.addEventListener("click", function () {
    console.log(account_editing)

    if (account_editing == "") {
        alert("Please select an account to delete")
        return
    }

    const delete_account = {
        "token": storedToken,
        "user": account_editing,
    }

    fetch(api + "/admin/delete_user", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(delete_account),
    })
        .then(response => response.text())
        .then(text => {
            window.location.reload()
        })
        .catch(error => {
            console.error("Erreur lors de l'envoi de la requête : ", error);
            window.location.href = "/error/error.html"
        })
})

const stat_allacount = document.getElementById("stat_allacount")
const stat_activetoken = document.getElementById("stat_activetoken")

const get_stats = {
    "token": storedToken,
    "user": account_editing,
}

fetch(api + "/admin/get_all_users_info", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(get_stats),
})
    .then(response => response.json())
    .then(text => {
        console.log(text)

        stat_allacount.innerText = text.numberAlltUser
        stat_activetoken.innerText = text.activeToken
    })
    .catch(error => {
        console.error("Erreur lors de l'envoi de la requête : ", error);
        window.location.href = "/error/error.html"
    })


    