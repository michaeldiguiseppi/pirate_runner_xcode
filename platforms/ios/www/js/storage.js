// Open local DB connection
var lawnchair = new Lawnchair({table:'localScores', adaptor:'webkit'}, function(){
    // Lawnchair setup!
});

// Getting some data out of the lawnchair database
lawnchair.get('my_data_key', function(obj) {
    if (obj !== undefined) {
        lastSyncDate = obj.lastSync;
        dataList = obj.dataList;
        console.log(dataList);
    }
});

var someData = {
                  test: 1
                };

var lastSync = new Date();
console.log(lastSync);
// Saving to the database
lawnchair.save({key:'my_data_key', lastSync: lastSync, dataList: someData});