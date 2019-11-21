const users = [];

const addUser = ({ id, name }) => {
    if (name.length <= 4) {
        return;
    }
    const user = {
        id,
        name
    };
    users.push(user);
    return { user };
};

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsers = () => users;

const getValidName = (id, name, counter) => {
    const user = users.find((user) => user.name === name);
    if(user) {
        counter++;
        if (counter > 1) {
            name = name.substr(0, name.lastIndexOf('('));
        }
        return getValidName(id, `${name}(${counter})`, counter);
    }
    return name;
};

module.exports = { addUser, removeUser, getUser, getUsers, getValidName };