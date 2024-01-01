import { useState } from "react";

// types
enum Type {
  String = 'string',
  Number = 'number',
}

type TType = `${Type}`;

interface Param {
  id: number;
  name: string;
  type: TType;
}

interface ParamValue {
  paramId: number;
  value: string | number;
}

interface Color {
  paramId: number;
  value: string;
}

interface Model {
  paramValues: Array<ParamValue>;
  colors: Array<Color>;
}

type TEntityBase = {
  id: number;
  label: string;
  color: string;
} 

type TEntityString = TEntityBase & {
  type: Type.String;
  value: string;
}

type TEntityNumber = TEntityBase & {
  type: Type.Number;
  value: number;
}

type TEntity = TEntityString | TEntityNumber;
//

// utils 
const getValues = (model: Model, params: Array<Param>): Array<TEntity> => params.map(({ id, name, type }) => {
    const base: TEntityBase = {
      id,
      label: name,
      color: model.colors.find(({ paramId }) => paramId === id )?.value || '',
    };

    switch(type) {
      case Type.String: {
        return { ...base, type: Type.String, value: model.paramValues.find(({ paramId }) => paramId === id )?.value as string, };
      }

      default: {
        return { ...base, type: Type.Number, value: model.paramValues.find(({ paramId }) => paramId === id )?.value  as number, };
      }
    }
  });

  const getModel = (entities: Array<TEntity>): Model => ({
    paramValues: entities.map(({ id, value }) => ({ paramId: id, value })),
    colors: entities.map(({ id, color }) => ({ paramId: id, value: color })),
  });
//

interface IEntityStringProps {
  onChange: (entity: TEntity) => void;
  entity: TEntityString;
}

const EntityString = ({ onChange, entity }: IEntityStringProps) => {
  const { id, label, value, color } = entity;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    onChange({ ...entity, value })
  };

  return (
    <div style={{ display: "grid", gap: 10, border: color ? `1px solid ${color}` : 'none', gridTemplateColumns: '1fr 1fr', padding: 10 }}>
      <label style={{ fontWeight: 600 }} htmlFor={String(id)}>{label}</label>
      <input style={{ fontWeight: 600 }} id={String(id)} value={value} onChange={handleChange} />
    </div>
  );
}

interface IEntityProps {
  onChange: (entity: TEntity) => void;
  entity: TEntity
}

const Entity = ({ entity, onChange }: IEntityProps) => {
  switch (entity.type) {
    case Type.String: {
      return <EntityString onChange={onChange} entity={entity} />;
    }

    default: {
      return <></>;
    }
  }
};

interface IProps {
  params: Array<Param>;
  model: Model;
}

const ParamEditor = ({ model, params }: IProps) => {
  const [entities, setEntities] = useState<Array<TEntity>>(() => getValues(model, params));

  const handleChange = (entity: TEntity) =>
    setEntities(prevState => {
      return prevState.map(item => item.id === entity.id ? entity : item);
    });

  const handleResult = () => console.log(getModel(entities));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 300 }}>
        {entities.map(entity => <Entity key={entity.id} onChange={handleChange} entity={entity} />)}
      </div>
      <button onClick={handleResult}>Result</button>
    </div>
  );
};

const App = () => {
  const model: Model = {
    paramValues: [
      {
        paramId: 1,
        value: 'повседневное',
      },
      {
        paramId: 2,
        value: 'макси',
      },
    ],
    colors: [
      {
        paramId: 1,
        value: 'red',
      },
      {
        paramId: 2,
        value: 'green',
      },
    ],
  };

  const params: Array<Param> = [
    {
      id: 1,
      name: 'Название',
      type: 'string',
    },
    {
      id: 2,
      name: 'Длина',
      type: 'string',
    },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <ParamEditor model={model} params={params} />
    </div>
  );
};

export default App
