function updateDevice(MACAddress){
    $.ajax({
        url: '/' + MACAddress,
        type: 'PUT',
        data: $('#updateDevice').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};