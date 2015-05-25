$(function () {

    // This must be a hyperlink
    $("#btnSave").on('click', function (event) {
        var url = CurSite.getAbsolutePath("./file/download.htm");
        window.open(url);
    });
})