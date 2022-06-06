import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { classToPlain, serialize } from 'class-transformer';
import { AdminEntity } from 'src/entities/admin.entity';
import { AdminUser } from 'src/models/admin.model';
import { QueryService } from 'src/shared/services/query.service';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(AdminEntity)
        private Admin: Repository<AdminEntity>,
        private queryService: QueryService
    ) {

    }

    async CreateAdmin(inputData): Promise<AdminUser> {
        try {
            const user: any = this.Admin.create(inputData)
            await this.Admin.save(user);
            return user
        } catch (error) {
            throw error
        }
    }

    FindAdminByRoleIdAndCreatedId = async (filter) => {
        var query = this.Admin.createQueryBuilder()
            .select("id, firstname, lastname, company, postcode, state, street, email, role, status, permissions, created_by, created_at, updated_at")
            .where('role = :role', { role: filter['role'] })

        if ('created_by_id' in filter && filter.created_by_id) {
            query = query.andWhere('created_by = :created_by', { created_by: filter['created_by_id'] })
        }
        const searchFields = {
            // 'id': 'uuid',
            'email': "text",
            'firstname': "text",
            'lastname': "text",
            'company': "text",
            'street': "text",
            'state': "text"
            // 'role': "number",
            // 'status': "number", 
            // 'created_by': "uuid",
            // 'created_at': "date",
            // 'updated_at': "date"
        }

        query = this.queryService.ApplySearchToQuery(query, filter, Object.entries(searchFields));

        const count = await query.getCount();
        const result = { count };

        query = this.queryService.ApplyPaginationToQuery(query, filter);

        if ('offset' in filter && filter.offset) {
            result['offset'] = filter['offset'];
        }
        if ('limit' in filter && filter.limit) {
            result['limit'] = filter.limit;
        }

        const data = await query.execute();
        result['data'] = data;

        return result;
    }

    FindAdminById(id) {
        return this.Admin.findOne({ where: { id } });
    }

    DeleteAdminQuery(id) {
        return this.Admin.createQueryBuilder()
            .delete()
            .from('Admin')
            .where('id = :id', { id })
    }

    UpdateAdminQuery(id, body) {
        const admin: any = this.Admin.create(body);
        return this.Admin.update({ id }, admin);
    }

}
