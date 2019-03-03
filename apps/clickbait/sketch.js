class Markov
{
    constructor()
    {
        this.map = { };
        this.map[null] = [];
    }

    add(chain)
    {
        this.map[null].push(chain[0]);
        for(let x=0;x<chain.length;x++)
        {
            let cur = chain[x];

            if(!(cur in this.map)) this.map[cur] = [];
            let next = this.map[cur];

            if(x!=chain.length-1) next.push(chain[x+1]);
            else next.push(null);
        }
    }

    getNext(cur)
    {
        let next = this.map[cur];
        return next[Math.floor(Math.random() * next.length)];
    }

    generate()
    {
        if(this.map[null].length>0)
        {
            let out = [];

            let cur = this.getNext(null);
            while(cur!=null)
            {
                out.push(cur);
                cur = this.getNext(cur);
            }
            return out;
        }
        return null;
    }
    
    generateString()
    {
        let generated = this.generate();
        let out = "";
        for(let x=0;x<generated.length;x++)
        {
            out+=generated[x]+" ";
        }
        return out;
    }
}

let canvas;
let height;
let width;
let key = 'AIzaSyCmgsnu6Yqj9xHF_DZWkPpL1U7Ikv08Kpk';

let thumbnails = [];
let titles = [];
let markov = new Markov();

function setup()
{
    //canvas = createCanvas(window.innerWidth, window.innerHeight);
    height = window.innerHeight;
    width = window.innerWidth;
    
    let url = getUrl();
    loadJSON(url, gotData);
}

function getUrl(token)
{
    if(token) return 'https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=50&pageToken='+token+'&regionCode=US&key='+key;
    else return 'https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=50&regionCode=US&key='+key;
}

function gotData(data)
{
    let videos = data.items;
    for(let x=0;x<videos.length;x++)
    {
    	let info = videos[x].snippet;
       	if(info.thumbnails.maxres) thumbnails.push(info.thumbnails.maxres.url);
        markov.add(info.title.split(" "));
		titles.push(info.title);
    }
    if(data.nextPageToken)
    {
		loadJSON(getUrl(data.nextPageToken),gotData);
    }
    else
    {
     	change();
		
		let titlesString ="";
		for(let x=0;x<titles.length;x++)
		{
			titlesString+=titles[x]+="\n";
		}
		
		$("#titles").text(titlesString);
    }
}

function change()
{
    $("#thumbnail").attr("src",thumbnails[Math.floor(Math.random() * thumbnails.length)]);
    let title = 
    $("#title").text(markov.generateString());
	
}

function onClick()
{
    change();
}

function draw() 
{
  //background(220);
}