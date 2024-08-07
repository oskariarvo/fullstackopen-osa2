const Course = ({course}) => {
    return (
      <div>
        <Header name={course.name} />
        <Content parts={course.parts}/>
        <Total parts={course.parts}/>
      </div>
    )
  }

const Header = ({name}) => <h2>{name}</h2>

const Content = ({parts}) => {
  return (
    <div>
      {parts.map(part => 
        <Part key={part.id} name={part.name} exercises={part.exercises} />
      )}
    </div>
  )
}
  
const Part = ({name, exercises}) => <p>{name} {exercises}</p>
  
const Total = ({parts}) => {
  const total_array = parts.map(part => part.exercises)
  const total_count = total_array.reduce( (s, p) => s + p)
  return <p>Number of exercises {total_count}</p>
}

export default Course