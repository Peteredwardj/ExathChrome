
console.log('Background running');
var urlArray=[]
audioObject=document.getElementById("OpenAudio")


const pusherKEY='INSERT PRIVATE KEY HERE'
var pusher = new Pusher(pusherKEY, {
    cluster: 'mt1'
  });


chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
  
    if (request.status=="ON"){
     
      pusher.connect('my-channel')
      var channel = pusher.subscribe('my-channel');
     
    
     
      chrome.storage.local.get(["PositiveKW","NegativeKW","KeywordInput"],function(data){ 
        console.log(data.KeywordInput);

        if(data.KeywordInput=="FALSE"){                                              //No keywords necessary
            var reponder= channel.bind('my-event', function(data) {
              var d = new Date();
              var n = d.toISOString();
            toOpen=(JSON.stringify(data.URLkey)).replace(/\"/g,"");
            if (!urlArray.includes(toOpen)){
               chrome.tabs.create({url:toOpen});
               audioObject.play();
               urlArray.push(toOpen);
               console.log(n);
            }
          }); }

        else{
          var Positive=[];
          var Negative=[];
          Positive=data.PositiveKW
          Negative=data.NegativeKW

          if (Positive.length==0){
            Positive.push(".")
          }
        
          
          var reponder= channel.bind('my-event', function(data) {
            toOpen=(JSON.stringify(data.URLkey)).replace(/\"/g,"");
            if (!urlArray.includes(toOpen)){
              if ((Negative.some(
                (value)=>{
                  return ((toOpen.toLowerCase()).includes(value));
                })==false) && (Positive.some((value)=>{
                 return ((toOpen.toLowerCase()).includes(value));
              })==true))
              {
                chrome.tabs.create({url:toOpen});
                urlArray.push(toOpen);
              }
              else{
                console.log("Ignored Link")
              }
            
            }
          });

        }

      })
    }
    else{
        pusher.disconnect('my-channel');
        urlArray=[];
    }

})