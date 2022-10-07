using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ListActivities
    {
        public class Query : IRequest<Result<List<UserActivityDto>>>
        {
            public string Predicate { get; set; }
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<UserActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _context = context;

            }

            public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var list = new List<UserActivityDto>();

                var date = DateTime.Now;

                switch (request.Predicate) 
                {
                    case "past":
                        list = await _context.ActivityAttendees
                             .Where(aa => aa.AppUser.UserName == request.Username)
                             .OrderBy(d => d.Activity.Date)
                             .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider, 
                                new{currentUsername = _userAccessor.GetUsername()})
                             .Where(u => u.Date <= date)
                             .ToListAsync();
                        break;
                    case "hosting":
                        list = await _context.ActivityAttendees
                            .Where(aa => aa.AppUser.UserName == request.Username)
                            .OrderBy(d => d.Activity.Date)
                            .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider, 
                                new{currentUsername = _userAccessor.GetUsername()})
                            .Where(u => u.HostUsername == request.Username)
                            .ToListAsync();
                        break;
                    default:
                        list = await _context.ActivityAttendees
                            .Where(aa => aa.AppUser.UserName == request.Username)
                            .OrderBy(d => d.Activity.Date)
                            .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider, 
                                new{currentUsername = _userAccessor.GetUsername()})
                            .Where(u => u.Date >= date)
                            .ToListAsync();
                        break;
                }

                return Result<List<UserActivityDto>>.Success(list);
            }
        }
    }
}