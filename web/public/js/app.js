var jsonToTable = function(json, tableName) {
    var table = "<table class='table-bordered'>";
    var parsed = json.results;
    var keys = getKeys(parsed[0]);
    table += getColumnHeaders(keys);

    $.each(parsed, function(i, val) {
    var row = '';
    var id;
    for (var key in val) {
        if (key !== 'id') {
            row += '<td>' + val[key] + '</td>';
        } else {
            id = val[key];
            row += "<tr data-id='" + val[key] + "'>";
        }
    }
    row += "<td><button data-type='" + tableName + "' data-id='" + id + "' class='btn btn-danger delete'>Delete</button></td>";
    row += "<td><button data-type='" + tableName + "' data-id='" + id + "' class='btn btn-info update'>Update</button></td>";
    row += '</tr>';
    table += row;
    });

    table += "</table>";
    return table;  
};

var getKeys = function(data) {
    var keys = [];
    for (var key in data) {
        keys.push(key);
    }
    return keys;
};

var getColumnHeaders = function(keys) {
    var header = '<tr>';

    for (var i = 0; i < keys.length; i++) {
        if (keys[i] !== 'id') {
            header += '<th>' + keys[i] + '</th>';
        }
    }
    header += '<th>Delete</th>';
    header += '<th>Update</th>';
    header += '</tr>';
    return header;
};

var composePost = function(e) {
    var data = {};
    var selector = '#' + $(e.target).attr('data-type') + ' .form-group';
    var entries = $(selector).each(function(i, el) {
        var label = $('label', el).text();
        if (label.length > 0) {
            var inputVal = $('input', el).val().length > 0 ? $('input', el).val() : null;
            data[label] = inputVal;
        }
    });

    return data;
};

var findUrl = function(e) {
    return '/' + $(e.target).attr('data-type');
};

var submitEntry = function(e) {
    e.preventDefault();
    var data = composePost(e);
    var url = findUrl(e);

    $.ajax({
        url: url,
        dataType: 'json',
        type: 'POST',
        data: data,
        success: function() {
            render();
        }
    });  
};

var deleteEntry = function(e) {
    e.preventDefault();
    var req = {};
    var id = $(e.target).attr('data-id');

    if (id !== 'undefined') {
        req = { 'id': id };
    } else {
        var selector = $(e.target).attr('data-type');
        var keysArr = $('#' + selector + ' th').map(function(){
            return $(this).text();              
        }).get();
        var valuesArr = $(e.target).closest('tr').children().map(function(){
            return $(this).text();
        });
        req[keysArr[0]] = valuesArr[0];
        req[keysArr[1]] = valuesArr[1];
    }

    $.ajax({
        url: '/delete',
        dataType: 'json',
        data: req,
        type: 'DELETE',
        success: function(data) {
            render();
        }
    }); 
}

var renderTable = function(url, selector) {
    $.ajax({
        url: url,
        dataType: 'json',
        success: function(data) {
            $(selector).html('');
            $(selector).append('<h3>' + selector.substring(1) + '</h3>' + jsonToTable(data, selector.substring(1)));
            $(selector + ' .save').on('click', submitEntry);
            $(selector + ' .delete').on('click', deleteEntry);
        }
    });
};

var makeSelect = function(data) {
    var str = '';
    for (var key in data) {
        str += "<option value='" + data[key] + "'>" + data[key] + "</option>"; 
    }
    return str;
};

var searchChar = function(e) {
    e.preventDefault();

    var MACAddr = $('#MAC').val();
    var obj = { 'MAC': MACAddr };
    console.log(obj);
    $.ajax({
        dataType: 'json',
        type: 'POST',
        url: '/search_mac',
        data: obj,
        success: function(data) {
            var results = data.results;
            $('.search_results').html('');
            for (var i = 0; i < results.length; i++) {
                var str = '<li>Timestamp: ' + results[i].timestamp + '  ---  Username: ' + results[i].username + '</li>';
                $('.search_results').append(str);
            }
        }
    });
};

var render = function() {
    renderTable('/devices', '#MACAddr');
    $('.search').on('click', searchChar);
};

$(document).ready(function() {
    render();
});
