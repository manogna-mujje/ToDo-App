// Function to perform a loop asynchronously

var tasks = [], i = 0;
function loop (docs, callback) {
 if (i < docs.length) {
   tasks.push(JSON.stringify(docs[i]));
   i++;
   callback(docs, callback);
 }
 return tasks;
}

module.exports = {
  loop
}
