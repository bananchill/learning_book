/**
 * Задача: Fluent Query Builder
 *
 * 1. Создайте класс QueryBuilder с fluent API (методы возвращают this):
 *    - select(...fields: string[]): this
 *    - from(table: string): this
 *    - where(condition: string): this — можно вызывать несколько раз
 *    - orderBy(field: string, direction?: "ASC" | "DESC"): this
 *    - build(): string — собирает SQL-запрос
 *
 * 2. Создайте наследника PaginatedQueryBuilder:
 *    - limit(n: number): this
 *    - offset(n: number): this
 *    - override build(): string — добавляет LIMIT и OFFSET
 *
 * Цепочка вызовов должна работать корректно для наследника.
 */

export class QueryBuilder {
  protected fields: string[] = ["*"];
  protected tableName: string = "";
  protected conditions: string[] = [];
  protected orderField: string | null = null;
  protected orderDirection: "ASC" | "DESC" = "ASC";

  select(...fields: string[]): this {
    this.fields = fields.length > 0 ? fields : ["*"];
    return this;
  }

  from(table: string): this {
    this.tableName = table;
    return this;
  }

  where(condition: string): this {
    this.conditions.push(condition);
    return this;
  }

  orderBy(field: string, direction: "ASC" | "DESC" = "ASC"): this {
    this.orderField = field;
    this.orderDirection = direction;
    return this;
  }

  build(): string {
    if (!this.tableName) {
      throw new Error("Таблица не указана. Используйте .from()");
    }

    let query = `SELECT ${this.fields.join(", ")} FROM ${this.tableName}`;

    if (this.conditions.length > 0) {
      query += ` WHERE ${this.conditions.join(" AND ")}`;
    }

    if (this.orderField) {
      query += ` ORDER BY ${this.orderField} ${this.orderDirection}`;
    }

    return query;
  }
}

export class PaginatedQueryBuilder extends QueryBuilder {
  private limitValue: number | null = null;
  private offsetValue: number | null = null;

  limit(n: number): this {
    if (n < 0) {
      throw new Error("LIMIT не может быть отрицательным");
    }
    this.limitValue = n;
    return this;
  }

  offset(n: number): this {
    if (n < 0) {
      throw new Error("OFFSET не может быть отрицательным");
    }
    this.offsetValue = n;
    return this;
  }

  override build(): string {
    let query = super.build();

    if (this.limitValue !== null) {
      query += ` LIMIT ${this.limitValue}`;
    }

    if (this.offsetValue !== null) {
      query += ` OFFSET ${this.offsetValue}`;
    }

    return query;
  }
}
