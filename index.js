const core = require("@actions/core");
const github = require("@actions/github");

try {
    // trigger: comment (on anything)
    //
    // `who-to-greet` input defined in action metadata file
    const githubToken = core.getInput("github_token", { required: true });
    // Create GitHub client which can be used in the user script
    const githubClient = new GitHub(githubToken);
    const permissionRes = await githubClient.repos.getCollaboratorPermissionLevel(
        {
            owner: context.repo.owner,
            repo: context.repo.repo,
            username: context.actor,
        }
    );
    if (permissionRes.status !== 200) {
        // eslint-disable-next-line no-console
        console.error(
            `Permission check returns non-200 status: ${permissionRes.status}`
        );
        return;
    }
    // const actorPermission = permissionRes.data.permission;
    const comment = context.payload.comment.body;
    const postComment = async (body) => {
        await githubClient.issues.createComment({
            // eslint-disable-next-line @typescript-eslint/camelcase
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body,
        });
    };
    postComment("yooo!!!!!");
    // const nameToGreet = core.getInput("who-to-greet");
    // console.log(`Hello ${nameToGreet}!`);
    // const time = new Date().toTimeString();
    // core.setOutput("time", time);
    // Get the JSON webhook payload for the event that triggered the workflow
    // const payload = JSON.stringify(github.context.payload, undefined, 2);
    // console.log(`The event payload: ${payload}`);
} catch (error) {
    core.setFailed(error.message);
}
