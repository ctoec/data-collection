import { Controller, Route, Get } from 'tsoa';
import { getConnection } from 'typeorm';
import { FlattenedEnrollment } from '../../entity';
import {
  getDataDefinition,
  DataDefinitionInfo,
} from '../../decorators/dataDefinition';

@Route('data-definitions')
export class DataDefinitionsController extends Controller {
  @Get('')
  public async getDataDefinitions() {
    return getConnection()
      .getMetadata(FlattenedEnrollment)
      .columns.map((column) =>
        getDataDefinition(new FlattenedEnrollment(), column.propertyName)
      )
      .filter((dataDefinition) => !!dataDefinition);
  }
}
