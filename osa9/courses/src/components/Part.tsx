import { CoursePart } from '../types';

interface PartProps {
  part: CoursePart;
}

const Part = (props: PartProps) => {
  const additionalInfo = () => {
    switch (props.part.kind) {
      case 'basic':
        return <i>{props.part.description}</i>;

      case 'group':
        return <>group project count: {props.part.groupProjectCount}</>;

      case 'background':
        return (
          <>
            <i>{props.part.description}</i>
            <br />
            background material: {props.part.backgroundMaterial}
          </>
        );

      case 'requirements':
        return (
          <>
            <i>{props.part.description}</i>
            <br />
            required skills:
            {props.part.requirements.join(', ')}
          </>
        );

      default: {
        const _exhaustiveCheck: never = props.part;
        return _exhaustiveCheck;
      }
    }
  };

  return (
    <div>
      <p>
        <b>
          {props.part.name} {props.part.exerciseCount}
        </b>
        <br />
        {additionalInfo()}
      </p>
    </div>
  );
};

export default Part;
