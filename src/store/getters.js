const getters={
    menuTree:state=>state.header.menuTree,
    collection:state=>state.container.collection,
    role:state=>state.container.role,
    user:state=>state.container.user,
    isAuthorized:state=>state.container.isAuthorized,
    componentStatus:state=>state.context.componentStatus,
    deploymentStatus:state=>state.context.deploymentStatus,
    metrics:state=>state.context.metrics,
    podStatus:state=>state.context.podStatus,
    replicaSetStatus:state=>state.context.replicaSetStatus,
    clusters:state=>state.table.clusters,
    proxyMenu:state=>state.proxy.proxyMenu

}
export default getters;
