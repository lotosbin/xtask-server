import {keyProject, projectLoader} from "./Project";
import {keyRelation, relationLoader} from "./Relation";
import {keyTask, taskLoader} from "./Task";

const c = {
    taskLoader: taskLoader,
    relation: relationLoader,
    projectLoader: projectLoader,
};
export default c;
