$(function () {
    $('#messageBtn').click(function () {
        $.ajax({
            type: 'post',
            url: 'api/comment',
            data: {
                content_id: $('#contentID').val(),
                content: $('#messageContent').val()
            },
            success: function (result) {
                add(result.data)
            }
        })
    })
    $.ajax({
        type: 'get',
        url: 'api/comment/get',
        data: {
            content_id: $('#contentID').val(),
        },
        success: function (result) {
            add(result)
        }
    })


    function add(result) {
        $('.messageList').empty()
        $('#messageCount').html(result.data.comment.length)
        var list = $('.pager li b').text().split('/')
        var page = Number(list[0])
        var pages = Number(list[1])
        console.log(page)
        for (var i = (page - 1) * 2; i < ((page - 1) * 2) + 2; i++) {
            try {
                let html = `<div class="messageBox" style="background-color: bisque; overflow: hidden; margin-bottom: 10px;">
			<p>${result.data.comment[i]['username']}</p>
			<div style="float: left;">${result.data.comment[i]['content']}</div>
            <div style="float: right;">${formatDate(result.data.comment[i]['addTime'])}</div>
        </div>`
                $('.messageList').prepend($(html))
            } catch (e) {
            }

        }

    }
    function formatDate(d) {
        var date1 = new Date(d);
        return date1.getFullYear() + '年' + (date1.getMonth() + 1) + '月' + date1.getDate() + '日' +
            date1.getHours() + ':' + date1.getMinutes() + ':' + date1.getSeconds()
    }
})