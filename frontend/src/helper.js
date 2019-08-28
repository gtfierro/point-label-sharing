const convertCSVTo2DArray = (csv) => {

    let data = []

    data[0] = Object.keys(csv[0]);

    console.log(data[0]);

    csv.forEach((row, i) => {
        let j = 0;
        data[0].forEach(key => {
            console.log(key);
            if (i !== 0) {
                data[i] = [];
                data[i][j] = row[key];
                j++;
            }
        });
    });

    return data;
};

const importAll = (r) => {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
};

export {
    convertCSVTo2DArray,
    importAll
};
