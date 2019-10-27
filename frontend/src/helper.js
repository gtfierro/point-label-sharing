const convertCSVTo2DArray = (csv) => {

    let data = [];

    data[0] = Object.keys(csv[0]);

    let i = 0;
    for (const row of csv) {
        data[i] = [];
        let j = 0;
        for (const key of Object.keys(csv[0])) {
            data[i][j] = row[key];
            j++;
        }
        i++;
    }

    return data;
};

const importAll = (r) => {
    let images = {};
    r.keys().map((item, index) => images[item.replace('./', '')] = r(item));
    return images;
};

const sliceData = (data, rows, cols) => {
    let result = [];
    let header = [];
    const headerlessData = data.slice(1);
    rows.forEach(rowIdx => {
        let row = [];
        cols.forEach(colIdx => {
            if (rowIdx === rows[0]) {
                header.push(data[0][colIdx]);
            }
            row.push(headerlessData[rowIdx][colIdx]);
        });
        result.push(row);
    });
    result.unshift(header);
    return result;
};

const removeMultipleIndices = (rows, indices) => {
    return rows.filter((value, index) => !indices.includes(index));
};

const desc = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
};

const stableSort = (array, cmp) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
};

const getSorting = (order, orderBy) => {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
};

export {
    convertCSVTo2DArray,
    importAll,
    sliceData,
    removeMultipleIndices,
    desc,
    stableSort,
    getSorting
};