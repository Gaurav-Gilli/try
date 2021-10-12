
    var language="en-us"
    $("#language").change(function(){
        language = $(this).children("option:selected").val();
    });
    var files
      $('#form').on('submit', function (e){
        e.preventDefault()
    //$('#upload-input').click();
    $("#button").text("Uploading File")
    $("#button").prop("disabled","true")
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
    convertFile()
});
$('#upload-input').on('change', function(){
  files = $(this).get(0).files;
  var fileExtension = ['pdf'];
        if ($.inArray($(this).val().split('.').pop().toLowerCase(), fileExtension) == -1) {
           $(this).val("") 
    
swal ( "Oops" ,"Please Upload a PDF File",  "error" )

        }
})

function convertFile(){
  if (files.length > 0){
    // create a FormData object which will be sent as the data payload in the
    // AJAX request
    var formData = new FormData();
    // loop through all the selected files and add them to the formData object
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      // add the files to formData object for the data payload
      formData.append('file', file, file.name);
    }
    console.log(formData)
    var formdata2 = new FormData()
    $.ajax({
      url: '/uploadpdftoaudio',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data){
          var data2 = {path:data.path,language:language}
          console.log('upload successful!\n' + data.path);
          $("#button").text("File Uploaded Now Processing")
          $("#button").prop("disabled",true);
          formdata2.append('path',data.path)
          $.ajax({
              url:'/pdftoaudio',
              type:'POST',
              data:JSON.stringify(data2),
              contentType: "application/json",
              dataType:"json",
      success:function(data){

        console.log(data)

          window.open('/download?path='+data.path)
          $("#button").text("Upload File")
          $("#button").prop("disabled",false);
          location.reload();
      }
          })
      },
      xhr: function() {
        // create an XMLHttpRequest
        var xhr = new XMLHttpRequest();
        // listen to the 'progress' event
        xhr.upload.addEventListener('progress', function(evt) {
          if (evt.lengthComputable) {
            // calculate the percentage of upload completed
            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);
            // update the Bootstrap progress bar with the new percentage
            $('.progress-bar').text(percentComplete + '%');
            $('.progress-bar').width(percentComplete + '%');
            // once the upload reaches 100%, set the progress bar text to done
            if (percentComplete === 100) {
              $('.progress-bar').html('Done');
            }
          }
        }, false);
        return xhr;
      }
    });
  }
}
