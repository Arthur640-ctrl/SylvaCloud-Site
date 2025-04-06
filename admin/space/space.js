const value = document.getElementById("value")
const icon = document.getElementById("icon")

value.innerHTML = ''
icon.innerHTML = ''

icon.innerHTML += `
<i class="fa-solid fa-triangle-exclamation"></i>
`

value.innerHTML += `
No disk selected
`

function set_info(data, name) {

    const disk_name = document.getElementById("disk_name")
    disk_name.innerText = "Disk name : " + name

    const VSpace = document.getElementById('virtual_space').getContext('2d')

    new Chart(VSpace, {
        type: 'pie',
        data: {
            labels: ['Free', 'Used'],
            datasets: [{
                data: [data["VSpace"]["used"], data["VSpace"]["free"]],
                backgroundColor: ['#007702', '#ff0000'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    })

    const RSpace = document.getElementById("reel_space").getContext("2d")
    new Chart(RSpace, {
        type: 'pie',
        data: {
            labels: ['Free', 'Used'],
            datasets: [{
                data: [data["RSpace"]["used"], data["RSpace"]["free"]],
                backgroundColor: ['#007702', '#ff0000'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    })

    const Perf = document.getElementById("performance-stats").getContext("2d")
    new Chart(Perf, {
        type: 'bar',
        data: {
            labels: ['Write (Mbs)', 'Read (Mbs)', 'IOPS'],
            datasets: [{
                data: [data["Performance"]["write_speed_MBps"], data["Performance"]["read_speed_MBps"], data["Performance"]["IOPS"]],
                backgroundColor: ['#0090aa', '#a9008f', '#e1a000'],
            }]
        },
        options: {
            responsive: true,
        }
    })

    value.innerHTML = ''
    icon.innerHTML = ''

    data["Content"]["Account"].forEach(file => {
        value.innerHTML += `
            <span>${file}</span>
        `
        icon.innerHTML += `
            <i class="fa-solid fa-circle-user"></i>
        `
    })

    data["Content"]["System"].forEach(file => {
        value.innerHTML += `
            <span>${file}</span>
        `
        icon.innerHTML += `
            <i class="fa-solid fa-gear"></i>
        `
    })
}





const disks_list = document.getElementById("disks_list")



disks_list.innerHTML = ``

const info_get_list_disks = {
    "token": storedToken,
}

function disk_list_load(disks) {
    disks.forEach(disk => {
        disks_list.innerHTML += `
        <div class="disk" data-id="${disk.name}">
            <div class="disk-info">
                <h4>${disk.name}</h4>
                <p>Server : Not Specified</p>
                <p>VSize : ${disk.free + disk.used}</p>
                <p>VUsed : ${disk.used}</p>
            </div>
        </div>
        `
    })

    document.querySelectorAll(".disk").forEach(button => {
        button.addEventListener("click", function () {
            const diskName = this.getAttribute("data-id")
            console.log("Nom du disk cliqué:", diskName)

            const infos_disk = {
                "token": storedToken,
                "disk": diskName,
            }
        
            fetch(api + "/admin/get_disk_info", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(infos_disk),
            })
                .then(response => response.json())
                .then(text => {
                    console.log(text)
                    set_info(text, diskName)
                })
                .catch(error => {
                    console.error("Erreur lors de l'envoi de la requête : ", error);
                })
        })
    })
}

fetch(api + "/admin/get_disks", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(info_get_list_disks),
})
    .then(response => response.json())
    .then(text => {
        disk_list_load(text)
    })
    .catch(error => {
        console.error("Erreur lors de l'envoi de la requête : ", error);
        window.location.href = "/error/error.html"
    })