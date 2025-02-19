
async function fetchVisitor() {
  const fetchData = await fetch("./선수제공파일/B_Module/visitors.json");
  const parseData = await fetchData.json();
  return parseData["data"];
}

function updateChartAndTable(visitorsData, leagueName, day, orientation) {
  const league = visitorsData.find((l) => l.name === leagueName);
  const dayData = league.visitors.find((d) => d.day === day);
  const visitorData = dayData.visitor;

  $("#visitorTable").empty();
  $("#visitorTable").append(
    `<thead><tr><th>시간대</th><th>방문자 수</th></tr></thead>`
  );
  const tbody = $("<tbody></tbody>");
  for (const [time, count] of Object.entries(visitorData)) {
    tbody.append(`<tr><td>${time}</td><td>${count}</td></tr>`);
  }
  $("#visitorTable").append(tbody);

  $("#chartArea").empty();
  if (orientation === "horizontal") {
    const chartContainer = $("<div></div>");
    Object.entries(visitorData).forEach(([time, count]) => {
      const percentage = (count / 500) * 100;
      const bar = $(`
      <div class="d-flex align-items-center" style="margin-top: 50px;">
          <div style="width: ${percentage}%; min-width: 20px; height: 20px; background-color: #007bff; color: white;">${count}</div>
          <span class="ml-2">${time}</span>
      </div>
  `);
      chartContainer.append(bar);
    });
    $("#chartArea").css({
      display: "block",
    });
    $("#chartArea").append(chartContainer);
  } else {
    const chartContainer = $(
      "<div class='d-flex align-items-end' style='height: 200px;'></div>"
    );
    Object.entries(visitorData).forEach(([time, count]) => {
      const barHeight = (count / 500) * 200;
      const bar = $(`
      <div class="d-flex flex-column align-items-center" style="margin: 0px 25px 0px 25px;">
      <div class="bar" style="width: 50px; height: ${barHeight}px; background-color: #007bff; color: white; display: flex; align-items: flex-end; justify-content: center;">${count}</div>
      <span>${time}</span>
      </div>
  `);
      chartContainer.append(bar);
    });
    $("#chartArea").css({
      display: "flex",
      "justify-content": "center",
      "text-align": "center",
    });
    $("#chartArea").append(chartContainer);
  }
}

async function initBaseballParkChart() {
  const visitorsData = await fetchVisitor();

  visitorsData.forEach((league) => {
    $("#leagueSelect").append(new Option(league.name, league.name));
  });

  const days = ["월", "화", "수", "목", "금", "토", "일"];
  days.forEach((day) => {
    $("#daySelect").append(new Option(day, day));
  });

  $("#leagueSelect, #daySelect, #chartOrientation")
    .change(function () {
      const selectedLeague = $("#leagueSelect").val();
      const selectedDay = $("#daySelect").val();
      const orientation = $("#chartOrientation").val();
      updateChartAndTable(
        visitorsData,
        selectedLeague,
        selectedDay,
        orientation
      );
    })
    .change();
}


async function getGoodsJson() {
  const a = await fetch("./선수제공파일/B_Module/goods.json");
  const b = await a.json();
  return b["data"];
}

async function goodsInit() {
  console.log("Initializing goods...");
  const goods = await getGoodsJson();
  const viewOptionsElem = document.querySelector("#viewOptions");
  const groups = [];

  goods.forEach((data) => {
    if (!groups.includes(data.group)) {
      groups.push(data.group);
    }
  });
  groups.forEach((data) => {
    viewOptionsElem.innerHTML += `<label><input type="checkbox" name="${data}" onclick="updateGoodsList()" checked> ${data}<label>`;
  });
  updateGoodsList(); 
}

async function updateGoodsList() {
  const groups = [];
  const goods = await getGoodsJson();
  goods.forEach((data) => {
    if (!groups.includes(data.group)) {
      groups.push(data.group);
    }
  });

  const sortFilter = document.querySelector("#sortFilter").value;
  switch (sortFilter) {
    case "priceDesc":
      goods.sort(
        (a, b) =>
          Number(b.price.replace(",", "")) - Number(a.price.replace(",", ""))
      ); 
      break;
    case "priceAsc":
      goods.sort(
        (a, b) =>
          Number(a.price.replace(",", "")) - Number(b.price.replace(",", ""))
      ); 
      break;
    case "sortDesc":
      goods.sort((a, b) => b.sale - a.sale);
      break;
    case "sortAsc":
      goods.sort((a, b) => a.sale - b.sale);
      break;
    default:
      break;
  }

  const goodsListElem = document.querySelector(`#goodsList`);
  const bestGoodsListElem = document.querySelector(`#bestGoodsList`);
  goodsListElem.innerHTML = "";
  bestGoodsListElem.innerHTML = "";
  for (let i = 0; i < goods.length; i++) {

    if (i < 3) {
      bestGoodsListElem.innerHTML += `<div id="goods${goods[i].idx
        }" class="card" style="width: 18rem;">
        <img src="./선수제공파일/B_Module/${goods[i].img
        }" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">[ BEST ] ${goods[i].title}</h5>
          <p class="card-text">가격 : ${goods[i].price}원</p>
          <p class="card-text">분류 : ${goods[i].group}</p>
          <p class="card-text">판매량 : ${goods[i].sale.toLocaleString()}</p>
          <button class="btn btn-primary" onclick="goodsEdit(this)">수정제안</button>
        </div>
      </div>`;
    } else {

      goodsListElem.innerHTML += `
        <div id="goods${goods[i].idx}" class="card" style="width: 18rem;">
        <img src="./선수제공파일/B_Module/${goods[i].img
        }" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${goods[i].title}</h5>
          <p class="card-text">가격 : ${goods[i].price}원</p>
          <p class="card-text">분류 : ${goods[i].group}</p>
          <p class="card-text">판매량 : ${goods[i].sale.toLocaleString()}</p>
          <button class="btn btn-primary" onclick="goodsEdit(this)">수정제안</button>
        </div>
      </div>
      `;
    }
  }
}

$(document).ready(function () {
  let selectedTextBox = null;

  $("#add-image-button").click(function () {
    $("#image-input").click();
  });

  $("#image-input").change(function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        $("#edit-area").css({
          "background-image": `url(${e.target.result})`,
          "background-size": "contain",
          "background-repeat": "no-repeat",
          "background-position": "center center",
          width: "100%",
          height: "400px",
        });
        adjustModalForContent();
      };
      reader.readAsDataURL(file);
    }
  });

  $("#text-box-button").click(function () {
    const textBox = $('<div contenteditable="true">텍스트</div>')
      .addClass("text-box")
      .css({
        position: "absolute",
        top: "10%",
        left: "10%",
        border: "1px solid #000",
        padding: "5px",
        cursor: "move",
        background: "rgba(255, 255, 255, 0.8)",
        minWidth: "50px",
        minHeight: "20px",
      })
      .draggable({

        containment: "#edit-area",
      })
      .on("click", function (e) {
 
        e.stopPropagation();
        $(".text-box").removeClass("selected-text-box");
        $(this).addClass("selected-text-box");
        selectedTextBox = this;
      });

    $("#edit-area").append(textBox);
  });

  $(document).keydown(function (e) {
    if (selectedTextBox && e.ctrlKey && e.keyCode === 39) {
      let currentRotation = $(selectedTextBox).data("rotation") || 0; 
      let newRotation = currentRotation + 90; 
      $(selectedTextBox)
        .css({
          transform: `rotate(${newRotation}deg)`, 
        })
        .data("rotation", newRotation); 
    }
  });

  function adjustModalForContent() {
    const maxHeight = $(window).height() * 0.8;
    $(".modal-body").css({
      "max-height": maxHeight + "px",
      "overflow-y": "auto",
    });
  }

  $(document).click(function () {
    $(".text-box").removeClass("selected-text-box");
    selectedTextBox = null;
  });
});

function goodsEdit(elem) {
  const goodsTitle = elem.parentElement.querySelector(".card-title").innerText;
  const modalElem = document.querySelector("#exampleModal");
  const modalTitleElem = modalElem.querySelector("h1#exampleModalLabel");

  modalTitleElem.innerText = `${goodsTitle} 수정제안`;

  $("#exampleModal").modal("show");
  adjustModalForContent();
}

function reservationModal(e) {
  let selectedDate = e.innerText;
  let league = document.getElementById("league").value;
  let time = document.getElementById("reservationTime").value;

  document.getElementById("selectedDateInput").value = selectedDate;


  let data = {
    league: league,
    time: time,
    selectedDate: selectedDate
  };
  console.log(data)
  $.ajax({
    type: "POST",
    url: "sub03_admin.php",
    data: data,
    success: function (response) {
      console.log(response);
    },
    error: function (xhr, status, error) {
      console.error(error);
    }
  });

  document.getElementById("selectedDate").innerText = "선택하신 날짜 : " + selectedDate + "일";
  $(".modal").modal("show");
  totalPrice = 50000;

  document.getElementById("totalPriceInput").value = totalPrice;

  document.getElementById("feeCalculateResult").innerText =
    "사용료 : " + totalPrice + "원";


}



let price = 0;

function feeCalculator(leagueElement, minPlayersElement) {
  const people = minPlayersElement.value;
  const league = leagueElement.value;
  const firstGame = document.getElementById("firstGame");
  const secondGame = document.getElementById("secondGame");
  const thirdGame = document.getElementById("thirdGame");

  let price = 0;

  switch (league) {
    case "나이트리그":
      price = 50000;
      firstGame.innerText = "19시";
      secondGame.innerText = "23시";
      thirdGame.style.display = "none";
      break;

    case "주말리그":
      price = 100000;
      firstGame.innerText = "09시";
      secondGame.innerText = "13시";
      thirdGame.style.display = "block";
      break;

    case "새벽리그":
      price = 30000;
      firstGame.innerText = "04시";
      secondGame.innerText = "07시";
      thirdGame.style.display = "none";
      break;

  }

  totalPrice = price + (people - 19) * 1000;
  console.log(totalPrice);

  totalPrice = totalPrice - 1000;
  console.log(totalPrice);

  document.getElementById("totalPriceInput").value = totalPrice;

  document.getElementById("feeCalculateResult").innerText =
    "사용료 : " + totalPrice + "원";
}


function showGoodsModal(goodsId) {
  $('#goodsModal' + goodsId).modal('show');
}

function goodsIdxValueCheck(button) {
  let goods_idx = button.parentNode.querySelector('[name="goods_idx"]').value;
  console.log(goods_idx);
}

$(document).ready(function(){
  $('#signupButton').click(function(){
      window.location.href = 'http://localhost/signup';
  });
  

  if(window.location.href.indexOf("localhost/signup") > -1) {
      $('#signupModal').modal('show');
  }
});