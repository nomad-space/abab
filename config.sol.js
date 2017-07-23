const _address = '0xF39cb77a333991ef967245C6FA550e0F8aCDD832'; // smart contract address
const _contract_fixed = 100000000;
const _name = "Abab";
const _symbol = "ABC";
const _abi = [{"constant":true,"inputs":[],"name":"GetRoomsCount","outputs":[{"name":"count","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_roomIndex","type":"uint256"},{"name":"_from","type":"uint256"}],"name":"RemoveSchedule","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_roomIndex","type":"uint256"}],"name":"GetSchedulesLength","outputs":[{"name":"length","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_roomIndex","type":"uint256"}],"name":"GetDescriptionHash","outputs":[{"name":"DescriptionHash","type":"uint160"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_roomIndex","type":"uint256"},{"name":"_from","type":"uint256"},{"name":"_to","type":"uint256"},{"name":"_dayPrice","type":"uint256"},{"name":"_weekPrice","type":"uint256"},{"name":"_monthPrice","type":"uint256"}],"name":"UpsertSchedule","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"rooms","outputs":[{"name":"roomDescriptionHash","type":"uint160"},{"name":"schedulesLength","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_roomIndex","type":"uint256"},{"name":"_roomDescriptionHash","type":"uint160"}],"name":"UpsertRoom","outputs":[{"name":"roomIndex","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_roomIndex","type":"uint256"}],"name":"RemoveRoom","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_roomIndex","type":"uint256"},{"name":"_from","type":"uint256"}],"name":"GetScheduleIndex","outputs":[{"name":"index","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_roomIndex","type":"uint256"},{"name":"_index","type":"uint256"}],"name":"GetScheduleByIndex","outputs":[{"name":"from","type":"uint256"},{"name":"to","type":"uint256"},{"name":"dayPrice","type":"uint256"},{"name":"weekPrice","type":"uint256"},{"name":"monthPrice","type":"uint256"}],"payable":false,"type":"function"}];
module.exports = {
    _address: _address,
    _contract_fixed: _contract_fixed,
    _name: _name,
    _symbol: _symbol,
    _abi: _abi,
};
// console.log(compiled);