import { useParams } from 'react-router-dom'

export default function EditRole() {
  const { id } = useParams()
  console.log(id)

  return <>Role ID: {id}</>
}
