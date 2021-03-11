$(function () { // Same as document.addEventListener("DOMContentLoaded"...

  // Same as document.querySelector("#navbarToggle").addEventListener("blur",...
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });

  // In Firefox and Safari, the click event doesn't retain the focus
  // on the clicked button. Therefore, the blur event will not fire on
  // user clicking somewhere else in the page and the blur event handler
  // which is set up above will not be called.
  // Refer to issue #28 in the repo.
  // Solution: force focus on the element that the click event fired on
  $("#navbarToggle").click(function (event) {
    $(event.target).focus();
  });
});

(function (global) {

var dc = {};

var allCategoriesUrl = "json/kategoriler.json";
var categoryHtml = "snippets/kategori.html";
var detayHTML = "snippets/detay.html";

var insertHtml = function (selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
};

var showLoading = function (selector) {
    var html = "<div class='text-center'>";
    html += "<img src='img/ajax-loader.gif'></div>";
    insertHtml(selector, html);
};

var insertProperty = function (string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    string = string
      .replace(new RegExp(propToReplace, "g"), propValue);
    return string;
}

var getDeviceURL = function(shortname){
    return "json/" + shortname + ".json";
}

document.addEventListener("DOMContentLoaded", function (event) {
    // On first load, show home view
    showLoading("#main-content");
    dc.HomePage();
});

dc.oneDevice = function(shortname){
    showLoading("#main-content");
    loadDevice(shortname);
}

dc.HomePage = function() {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
        categoryHtml, function(categoryHtml){
            $ajaxUtils.sendGetRequest(
                allCategoriesUrl, function(categories){
                    var html = "<div class='jumbotron text-center'><img ><h1>Anasayfa</h1></div>";
                    var categoriesViewHtml =  buildCategoriesHTML(categoryHtml, categories);
                    insertHtml("#main-content", html + categoriesViewHtml);
                },
                true
            );
        },
        false
    );
};

function buildCategoriesHTML(htmlParam, data){
    var finalHTML = "<div class='container-fluid'>";
    for(var i = 0; i < data.length; i++){
        var html = htmlParam;
        var name= "" + data[i].name;
        var shortname = data[i].shortname;
        html = insertProperty(html, "name", name);
        html = insertProperty(html, "shortname", shortname);
        finalHTML += html;
    }
    finalHTML += "</div>";
    return finalHTML;
};


function loadDevice(shortname) {
    showLoading("#main-content");
    var deviceURL = getDeviceURL(shortname);
    $ajaxUtils.sendGetRequest(
      detayHTML, function(detayHTML){
            $ajaxUtils.sendGetRequest(
                    deviceURL, function(devices){
                    var html = "<div class='container-fluid'>"
                    var detayViewHtml =  buildBookHtml(detayHTML, devices, shortname) + "</div>";
                    insertHtml("#main-content", html + detayViewHtml);
                },
                true
            );
        },
        false
    );
};


// Using category and menu items data and snippets html
// build menu items view HTML to be inserted into page
function buildBookHtml(detayHTML, data, shortname) {

  var finalHtml = "<div class='container-fluid'>";

  // Loop over menu items
  for (var i = 0; i < data.length; i++) {
    // Insert menu item values
    var html = detayHTML;
    html =
      insertProperty(html, "shortname", shortname);
    html =
      insertProperty(html, "name", data[i].name);
    html =
      insertProperty(html, "model", data[i].model);
    html = 
      insertProperty(html, "date", data[i].date);
    html = 
      insertProperty(html, "info", data[i].info);

    finalHtml += html;
  }

  finalHtml += "</div>";
  return finalHtml;
  
}





global.$dc = dc;
})(window);


