import {projectLoader} from "./Project";
import {relationLoader} from "./Relation";
import {taskLoader} from "./Task";
import {userLoader} from "./User";
import {groupLoader} from "./Group";

const loaders: any = {
    taskLoader: taskLoader,
    relation: relationLoader,
    projectLoader: projectLoader,
    userLoader: userLoader,
    groupLoader: groupLoader,
};
export default loaders;
