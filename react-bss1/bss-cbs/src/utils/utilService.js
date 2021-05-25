import _ from 'lodash';

export const prepareDropdownData = (list = [], key, val) => {
    return _.map(list, item => {
        return {
            label: item[key],
            value: val ? item[val] : item
        };
    });
};