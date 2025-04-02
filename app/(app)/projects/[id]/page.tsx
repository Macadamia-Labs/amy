export default function ProjectPage({
    params, 
}: {
    params: {
        id: string
    }
}) {
    const { id } = params

    return <div>Project {id}</div>
}
