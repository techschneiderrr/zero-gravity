// import logo from "./logo.svg";
import "./App.css";

const Tabletop = require("tabletop");

let google_sheets = {};
let loaded = 0;

function init(publicKey, year) {
  Tabletop.init({
    key: publicKey,
    error: () => {
      window.location.reload();
    },
  }).then((data) => {
    google_sheets[`${year}`] = Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k.toLowerCase(), v])
    );
    loaded++;

    if (loaded === 3) {
      document.getElementById("loader-wrapper").style.display = "none";
      document.getElementById("wrapper").style.display = "flex";
      createVideo();
    }
  });
}

init(
  "https://docs.google.com/spreadsheets/d/1sjX5g6h7Wbk2HOONr8BOWIRs6GZfJcRmZpccfqDqk5c/",
  21
);
init(
  "https://docs.google.com/spreadsheets/d/1OVZs9LDlQS2A5cVyfBGSmqObH2DseV_erw4NJbdP3GM/",
  20
);
init(
  "https://docs.google.com/spreadsheets/d/1yDYsrO7BhvMkj6DDhsXBa0-_3k6h8BaALkOsZtOFsZI/",
  19
);

function buildCards(objects) {
  // Resetting previous cards
  if (document.getElementById("results"))
    document.getElementById("results").remove();

  // Building cards
  let container = document
    .getElementById("wrapper")
    .appendChild(document.createElement("div"));
  container.id = "results";

  let cards = container.appendChild(document.createElement("ul"));
  cards.className = "cards";

  for (let object of objects) {
    let cards_item = cards.appendChild(document.createElement("li"));
    cards_item.className = "cards_item";

    let card = cards_item.appendChild(document.createElement("div"));
    card.className = "card";

    let card_content = card.appendChild(document.createElement("div"));
    card_content.className = "card_content";

    for (let label in object) {
      if (object.hasOwnProperty(label)) {
        let card_text = card_content.appendChild(document.createElement("p"));
        card_text.className = "card_text";

        card_text.innerHTML = `<b>${label}:</b> ${object[label] || " "}`;
      }
    }
  }

  // Validate
  let num_cards = Object.keys(objects).length;
  if (num_cards === 0) {
    cards.innerHTML = "";

    let modal = document.getElementById("modal");
    modal.style.display = "block";

    let span = document.getElementsByClassName("close")[0];

    span.onclick = function () {
      modal.style.display = "none";
    };

    window.onclick = function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };
  }
}

function createVideo() {
  let videos = [
    "https://www.youtube.com/embed/CuSjVuIBV80",
    "https://www.youtube.com/embed/27NpldOjCCM",
    "https://www.youtube.com/embed/dh62rJ31B-I",
  ];

  let responsive_iframe = document
    .getElementById("video")
    .appendChild(document.createElement("iframe"));
  responsive_iframe.className = "responsive-iframe";
  responsive_iframe.title = "YouTube video";
  let video_num = Math.floor(Math.random() * videos.length);
  responsive_iframe.src = videos[video_num] + "?autoplay=1&mute=1";
}

function App() {
  function renderTable() {
    if (document.getElementById("video"))
      document.getElementById("video").remove();

    let cards = [];
    let labels = [
      "Card Code Number",
      // "Quotation Number",
      "Bride or Client Name",
      "Groom",
      "Event Type",
      "Event Date",
      "OG Final Status",
      // "OG_Delivery Status",
      // "OG Delivered Date",
      "Frame Final Status",
      // "Frame_Print Status",
      // "Frame_Delivery Status",
      // "Frame Delivered Date",
      "IP Final Status",
      // "IP_Delivery Status",
      // "IP Delivered Date",
      "Client Completion Status",
      "Album Team Final Status",
      "Montage Final Status",
      "TV_Team Final Status",
      "CV Final Status",
      "CC Final Status",
      "CA_Delivery Status",
      "CA Final Status",
      "Magazine Final Status",
    ];

    let cardCode = document.forms["search"]["card-code"].value;
    let year = document.forms["search"]["year"].value;
    let sheet = document.forms["search"]["sheet"].value + year;
    let sheets = google_sheets[year];

    for (let element of sheets[sheet]["elements"]) {
      if (cardCode === "") continue;
      if (
        element["Card Code Number"] === cardCode ||
        element["Client Number"] === cardCode
      ) {
        let card = {};
        labels.forEach((label) => {
          card[label] = element[label];
        });
        cards.push(card);
      }
    }

    buildCards(cards);
  }

  return (
    <div id="container">
      <div id="loader-wrapper">
        <nav className="navbar navbar-light my-3">
          <a
            className="navbar-brand my-3"
            href="https://zerogravity.photography/"
          >
            <img
              className="image my-3"
              src="https://zerogravity.photography/wp-content/themes/primary/static/images/logo-zerogravity.png"
              margin="5px"
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt=""
            />{" "}
            Zero gravity photography
          </a>
        </nav>
        <div id="loader"></div>
      </div>
      <div id="wrapper">
        <nav className="navbar navbar-light my-3">
          <a className="navbar-brand" href="https://zerogravity.photography/">
            <img
              className="image my-3"
              src="https://zerogravity.photography/wp-content/themes/primary/static/images/logo-zerogravity.png"
              margin="5px"
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt=""
            />{" "}
            Zero gravity photography
          </a>
        </nav>
        <form
          name="search"
          onSubmit={(e) => {
            e.preventDefault();
            renderTable();
          }}
        >
          <select defaultValue={"21"} name="year" id="year">
            <option value="19">2019</option>
            <option value="20">2020</option>
            <option value="21">2021</option>
          </select>
          <select
            defaultValue={"jan"}
            name="sheet"
            style={{ borderColor: "E82D96" }}
            id="sheet"
          >
            <option value="DEFAULT" disabled hidden>
              Month/YY
            </option>
            <option value="jan">Jan</option>
            <option value="feb">Feb</option>
            <option value="mar">Mar</option>
            <option value="apr">Apr</option>
            <option value="may">May</option>
            <option value="jun">Jun</option>
            <option value="jul">Jul</option>
            <option value="aug">Aug</option>
            <option value="sep">Sep</option>
            <option value="oct">Oct</option>
            <option value="nov">Nov</option>
            <option value="dec">Dec</option>
          </select>
          <input type="text" name="card-code" placeholder="card code number" />
          <input
            type="button"
            value="Search"
            id="search-button"
            onClick={renderTable}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                renderTable();
              }
            }}
          />
        </form>
        <div id="video"></div>
      </div>
      <div id="modal" className="modal">
        <div className="modal-content">
          <p>No results</p>
          <span className="close">&times;</span>
        </div>
      </div>
    </div>
  );
}

export default App;
