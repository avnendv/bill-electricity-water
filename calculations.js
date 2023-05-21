"use strict";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const electricPrice = $("#electric-price");
const waterPrice = $("#water-price");
const floorNum = $("#floor-num");
const calculatorButton = $("#calculator");

const floorInfoInsert = function (length) {
  let html = "";
  for (let index = 1; index <= length; index++) {
    html += `
    <div class="floor-content-wrapper">
      <h4>Tầng ${index}</h4>
      <div class="form-group">
        <label for="">Số người ở:</label>
        <input
          type="number"
          id="people-num-${index}"
          class="people-num"
          min="1"
          value="1"
          placeholder="Nhập số người ở..."
        />
      </div>
      <div class="form-group">
        <label for="">Số khối điện:</label>
        <input
          type="number"
          id="block-num-${index}"
          class="block-num"
          min="1"
          value="1"
          placeholder="Nhập số khối điện..."
        />
      </div>
    </div>
  `;
  }
  const floorInfo = $("#floor-info");
  floorInfo.innerHTML = html;
};

const calculationResultInsert = function (
  data,
  dataTotal,
  waterPricePerPeople
) {
  const resultElement = $("#result");
  resultElement.innerHTML = "Đang tính toán...";
  let html = "";
  data.forEach((element) => {
    const electricPricePerFloor =
      (+electricPrice.value * element.block) / dataTotal.block;
    const waterPricePerFloor = waterPricePerPeople * element.people;
    html += `
      <ul>
        Tầng ${element.floor}:
        <li>Tổng tiền điện: ${electricPricePerFloor} VNĐ</li>
        <li>Tổng tiền nước: ${waterPricePerFloor} VNĐ</li>
        <li>Tổng tiền: ${(electricPricePerFloor + waterPricePerFloor).toFixed(
          0
        )}</li>
      </ul>
    `;
  });

  resultElement.innerHTML = html;
};

const handleCalculation = function () {
  const dataTotal = {
    people: 0,
    block: 0,
  };
  if (electricPrice <= 0 || waterPrice <= 0) return;

  const data = [...$$(".floor-content-wrapper")].reduce((prev, curr, index) => {
    const peopleNum = +$(`#people-num-${++index}`).value;
    const blockNum = +$(`#block-num-${index}`).value;
    if (peopleNum <= 0 || blockNum <= 0) return;

    dataTotal.people += peopleNum;
    dataTotal.block += blockNum;

    return [
      ...prev,
      {
        floor: index,
        people: peopleNum,
        block: blockNum,
      },
    ];
  }, []);

  const waterPricePerPeople = waterPrice.value / dataTotal.people;
  calculationResultInsert(data, dataTotal, waterPricePerPeople);
};

floorInfoInsert(floorNum.value);

floorNum.addEventListener("change", function (e) {
  const value = e.target.value;
  if (value <= 0) return;
  floorInfoInsert(value);
});

calculatorButton.addEventListener("click", function (e) {
  e.preventDefault();
  handleCalculation();
});
