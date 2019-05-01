const cheerio = require('cheerio');
const sqlite3 = require('sqlite3').verbose();
let jobs = [];

// Get the HTML for positions... prompt()
   async function getHTML() {
      let res = await axios.get('https://weworkremotely.com/remote-jobs/search?utf8=%E2%9C%93&term=frontend');
      return res.data;
   }


 /* Fetch company name, job title and source URL */

function firstFetch(html){
// Fetch jobs(company name, job title and source URL)
function getJobs(html){

  const $ = cheerio.load(html);

function firstFetch(html){
}
 
 // Fetch job details, job location and url to apply
function secondFetch(html){

function getJobDetails(html){

const $ = cheerio.load(html);
var urlDuCv = $('#post-job-cta').attr('href');
       var location = $('.region').text().substr(17); //Remove Must Be located: 
       var job_description = $('.listing-container').html();
  //console.log(urlDuCv);
  return [urlDuCv, location, job_description];
       const urlDuCvc = $('#post-job-cta').attr('href');
       const location = $('.region').text().substr(17); //Remove Must Be located:
       const jobDescription = $('.listing-container').html();
         return [urlDuCvc, location, jobDescription];
  
  39   
  
  
}
  40   39  
  41   40  
  42      -// Fetch each url in the array
  43      -async function processArray(array) {
       41 +// Fetch data from each url in the job details
       42 +async function getDataFromJobDetails(jobs) {
  44   43  
  45   44      try {
  46   45  
  47      -    const promises = array.map(async (job)=> {
       46 +    const promises = jobs.map(async (job)=> {
  48   47          let res = await axios.get('https://weworkremotely.com'+job.url);
  49      -        [job.urlToApply, job.location, job.job_description] = await secondFetch(res.data);   
       48 +        [job.urlToApply, job.location, job.jobDescription] = await getJobDetails(res.data);
  50   49      })
  51   50      await Promise.all(promises);
  52   51  
          @@ -56,29 +55,27 @@ async function processArray(array) {
  56   55    }
  57   56  
  58   57  
  59      -//get jobs from weworkremotely.com
       58 +// Get jobs from weworkremotely.com
  60   59  async function getWWRjobs(html) {
  61   60  
  62      -    await firstFetch(html);
       61 +    await getJobs(html);
       62 +
       63 +    await getDataFromJobDetails(jobs);
  63   64  
  64      -    await processArray(jobs);
  65      -    
  66   65     return jobs
  67   66  }
  68   67  
  69   68  
       69 +const writeToDB = function(){
  70   70  
  71      -
  72      -var writeToDB = function(){
  73      -    
  74   71      const db = new sqlite3.Database('jobs.db');
  75   72  
  76   73      db.serialize(function(){
  77   74          db.run("CREATE TABLE frontendjobs (company TEXT, Title TEXT, url TEXT, urlToApply TEXT)");
  78   75  
  79      -        var stmt = db.prepare("INSERT INTO frontendjobs VALUES (?,?,?,?)");
       const stmt = db.prepare("INSERT INTO frontendjobs VALUES (?,?,?,?)");
  
  for (var i=0; i<jobs.length; i++){
       78 +        for (let i = 0; i < jobs.length; i++){
  82   79              stmt.run(jobs[i].company,jobs[i].title,'https://weworkremotely.com'+jobs[i].url, jobs[i].urlToApply);
  83   80          }
  84   81  
          @@ -91,18 +88,21 @@ var writeToDB = function(){
  91   88  
  92   89  }
  93   90  
  94      -/* fetch job board w/o writing to db*/
  95      -async function go (){
  96      -    console.log(await getWWRjobs(await getHTML()));    
       91 +// Fetch job board w/o writing to db
       92 +async function debug(){
       93 +    const html = await getHTML()
       94 +    const jobs = await getWWRjobs(html)
       95 +    console.log(jobs);
  97   96  }
  98   97  
  99      -/* fetch job board and write to db*/
 100      -async function update(){
 101      -    await getWWRjobs(await getHTML())
       98 +// Initialize scrapper. Fetch job board and write to db.
       99 +async function init(){
      100 +    const html = await getHTML()
      101 +    await getWWRjobs(html)
 102  102      await writeToDB();
 103  103  }
 104  104  
 105  105  
 106      -go();
      106 +debug();
 107  107  
 108      -//update();
          \ No newline at end of file
//init();
          \ No newline at end of file
